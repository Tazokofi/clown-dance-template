import { getUserFromRequest, json, err } from '../auth/_helpers.js';
export async function onRequestPost({ env, request }) {
  const user = await getUserFromRequest(request, env.DB);
  if (!user || !user.is_admin) return err('Admin only', 403);
  const { user_id, banned } = await request.json();
  await env.DB.prepare('UPDATE users SET is_banned = ? WHERE id = ?').bind(banned ? 1 : 0, user_id).run();
  return json({ user_id, banned: !!banned });
}
