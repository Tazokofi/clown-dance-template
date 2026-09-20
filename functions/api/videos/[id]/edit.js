import { getUserFromRequest, json, err } from '../../auth/_helpers.js';

export async function onRequestPost({ params, env, request }) {
  const user = await getUserFromRequest(request, env.DB);
  if (!user || !user.is_admin) return err('Admin only', 403);

  const { title, description, bunny_video_id, thumbnail_url, duration_seconds, tag } = await request.json();
  if (!title || !bunny_video_id) return err('Title and Bunny video ID required');
  const safeDuration = Number.isFinite(duration_seconds) && duration_seconds > 0 ? Math.floor(duration_seconds) : 0;
  const safeTag = (tag || '').slice(0, 60);
  const video_id = parseInt(params.id);

  await env.DB.prepare(
    'UPDATE videos SET title = ?, description = ?, bunny_video_id = ?, thumbnail_url = ?, duration_seconds = ?, tag = ? WHERE id = ?'
  ).bind(title, description || '', bunny_video_id, thumbnail_url || '', safeDuration, safeTag, video_id).run();

  return json({
    id: video_id, title, description: description || '',
    bunny_video_id, thumbnail_url: thumbnail_url || '', duration_seconds: safeDuration, tag: safeTag
  });
}
