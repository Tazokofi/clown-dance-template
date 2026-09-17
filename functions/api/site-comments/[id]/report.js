import { getUserFromRequest, json, err } from '../../auth/_helpers.js';

export async function onRequestPost({ params, env, request }) {
  const user = await getUserFromRequest(request, env.DB);
  if (!user) return err('Sign in to report', 401);
  const { reason } = await request.json();
  const comment_id = parseInt(params.id);
  try {
    await env.DB.prepare(
      'INSERT INTO site_comment_reports (comment_id, user_id, reason, created_at) VALUES (?, ?, ?, ?)'
    ).bind(comment_id, user.id, reason || 'inappropriate', Date.now()).run();
    await env.DB.prepare('UPDATE site_comments SET report_count = report_count + 1 WHERE id = ?').bind(comment_id).run();
    await env.DB.prepare('UPDATE site_comments SET is_hidden = 1 WHERE id = ? AND report_count >= 3').bind(comment_id).run();
    return json({ reported: true });
  } catch(e) {
    if (e.message?.includes('UNIQUE')) return err('Already reported', 409);
    throw e;
  }
}
