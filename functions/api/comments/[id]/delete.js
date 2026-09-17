import { getUserFromRequest, json, err } from '../../auth/_helpers.js';

export async function onRequestPost({ params, env, request }) {
  const user = await getUserFromRequest(request, env.DB);
  if (!user) return err('Not authenticated', 401);
  const comment_id = parseInt(params.id);
  const comment = await env.DB.prepare('SELECT user_id, video_id FROM comments WHERE id = ?').bind(comment_id).first();
  if (!comment) return err('Comment not found', 404);
  if (!user.is_admin && comment.user_id !== user.id) return err('Not allowed', 403);
  await env.DB.prepare('UPDATE comments SET is_deleted = 1 WHERE id = ?').bind(comment_id).run();
  await env.DB.prepare('UPDATE videos SET comment_count = MAX(0, comment_count - 1) WHERE id = ?').bind(comment.video_id).run();
  return json({ deleted: true });
}
