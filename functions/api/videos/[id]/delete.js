import { getUserFromRequest, json, err } from '../../auth/_helpers.js';

// Admin-only: soft-delete a video (flip is_deleted rather than removing
// the row) so it disappears from the site immediately but nothing --
// comments, votes, view history -- is actually lost if this was clicked
// by mistake.
export async function onRequestPost({ params, env, request }) {
  const user = await getUserFromRequest(request, env.DB);
  if (!user || !user.is_admin) return err('Admin only', 403);

  const video_id = parseInt(params.id);
  if (!video_id) return err('Invalid video id');

  const video = await env.DB.prepare('SELECT id FROM videos WHERE id = ?').bind(video_id).first();
  if (!video) return err('Video not found', 404);

  await env.DB.prepare('UPDATE videos SET is_deleted = 1 WHERE id = ?').bind(video_id).run();
  return json({ deleted: true, id: video_id });
}
