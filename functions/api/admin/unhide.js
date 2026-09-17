import { getUserFromRequest, json, err } from '../auth/_helpers.js';

export async function onRequestPost({ env, request }) {
  const user = await getUserFromRequest(request, env.DB);
  if (!user || !user.is_admin) return err('Admin only', 403);
  const { comment_id, kind } = await request.json();
  const table = kind === 'site' ? 'site_comments' : 'comments';
  const reportsTable = kind === 'site' ? 'site_comment_reports' : 'comment_reports';
  await env.DB.prepare(`UPDATE ${table} SET is_hidden = 0, report_count = 0 WHERE id = ?`).bind(comment_id).run();
  await env.DB.prepare(`DELETE FROM ${reportsTable} WHERE comment_id = ?`).bind(comment_id).run();
  return json({ unhidden: true });
}
