import type { SelectPaystub } from '$lib/types/db.model';
import { drizzleClient } from '../client';

export const getPaystubs = async (clientId: string, startDate: number, endDate: number): Promise<SelectPaystub[]> => {
  if (!clientId) {
    return [];
  }
  
  const data = await drizzleClient.query.paystub.findMany({
    where: (ps, { eq }) => eq(ps.clientId, clientId),
    with: {
      employee: true,
      sales: {
        with: {
          employee: true,
        },
        where: (s, { and, gte, lte }) => and(
          gte(s.saleDate, startDate as any),
          lte(s.saleDate, endDate as any),
        ),
        orderBy: (s, { desc }) => [desc(s.saleDate)],
      },
    },
  });
  
  return data || [];
}