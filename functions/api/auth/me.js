import { getUserFromRequest, json } from './_helpers.js';
export async function onRequestGet({ request, env }) {
  const user = await getUserFromRequest(request, env.DB);
  if (!user) return new Response(null, { status: 401 });
  return json(user);
}
