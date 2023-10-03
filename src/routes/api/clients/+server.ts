import { json } from '@sveltejs/kit';


/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	// do something
  const data = await request.json();
  
  return json(data);
}