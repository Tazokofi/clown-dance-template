import { getUserFromRequest, json, err } from '../../auth/_helpers.js';

export async function onRequestPost({ params, env, request }) {
  const user = await getUserFromRequest(request, env.DB);
  if (!user) return err('Not authenticated', 401);
  const comment_id = parseInt(params.id);
  const comment = await env.DB.prepare('SELECT user_id FROM site_comments WHERE id = ?').bind(comment_id).first();
  if (!comment) return err('Comment not found', 404);
  if (!user.is_admin && comment.user_id !== user.id) return err('Not allowed', 403);
  await env.DB.prepare('UPDATE site_comments SET is_deleted = 1 WHERE id = ?').bind(comment_id).run();
  return json({ deleted: true });
}
