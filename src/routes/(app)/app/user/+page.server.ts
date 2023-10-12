import { createUser, getUserProfileData, getUsers } from '$lib/drizzle/mysql/models/users';
import type { InsertUser, InsertUserKey, InsertUserProfile, RoleTypes } from '$lib/types/db.model.js';
import { json } from '@sveltejs/kit';
import { nanoid } from 'nanoid';


export const load = async ({locals}) => {
  const session = await locals.auth.validate();
  
  if (!session) {
    return {
      status: 401,
    };
  }
  
  const users = async () => {
    const profile = await getUserProfileData(session?.user.userId);
    
    if (!profile) {
      return [];
    }
    
    const users = await getUsers(profile?.clientId as string);
    
    return users;
  }
  
  return {
    session,
    users: await users(),
  };
}

export const actions = {
  add: async ({ locals, request }) => {
    const session = await locals.auth.validate();
    if (!session) {
      return {
        status: 401,
      };
    }
    
    const payload = await request.formData();
    const data = Object.fromEntries(payload.entries()) as { 
      first_name: string;
      last_name: string;
      email: string;
      role: string;
      client_id: string;
    };
    
    const insertUser: InsertUser = {
      id: nanoid(),
      email: data.email,
      emailVerified: false,
    };
    
    const insertUserKey: InsertUserKey = {
      id: `email:${data.email}`,
      userId: insertUser.id,
    }
    
    const insertUserProfile: InsertUserProfile = {
      id: nanoid(),
      userId: insertUser.id,
      firstName: data.first_name,
      lastName: data.last_name,
      clientId: data.client_id,
      role: data.role as RoleTypes,
    };
    
    return await createUser(insertUser, insertUserKey, insertUserProfile);
  }
}