import { getUserFromRequest, json, err } from '../auth/_helpers.js';
export async function onRequestPost({ env, request }) {
  const user = await getUserFromRequest(request, env.DB);
  if (!user || !user.is_admin) return err('Admin only', 403);
  const { comment_id } = await request.json();
  await env.DB.prepare('UPDATE comments SET is_hidden = 0, report_count = 0 WHERE id = ?').bind(comment_id).run();
  await env.DB.prepare('DELETE FROM comment_reports WHERE comment_id = ?').bind(comment_id).run();
  return json({ unhidden: true });
}
