import { getUserFromRequest, json, err } from '../auth/_helpers.js';

export async function onRequestGet({ env, request }) {
  const user = await getUserFromRequest(request, env.DB);
  const { results } = await env.DB.prepare(
    `SELECT v.id, v.title, v.description, v.bunny_video_id, v.thumbnail_url, v.duration_seconds,
            v.view_count, v.like_count, v.dislike_count, v.comment_count, v.tag, v.orientation, v.created_at
            ${user ? `, (SELECT vote FROM video_votes WHERE video_id = v.id AND user_id = ${user.id}) as my_vote` : ', NULL as my_vote'}
     FROM videos v ORDER BY v.created_at DESC`
  ).all();
  // Only cache the anonymous shape of this response at Cloudflare's edge --
  // when `user` is set, `my_vote` is personal to them, and the edge cache
  // doesn't key on cookies, so caching a logged-in response risks serving
  // one visitor's vote state to someone else. Signed-out visitors (the vast
  // majority of page loads) get s-maxage=60/SWR=300, which keeps D1 read
  // volume flat under traffic spikes; signed-in requests always hit D1.
  const cacheControl = user
    ? 'private, no-store'
    : 'public, s-maxage=60, stale-while-revalidate=300';
  return json(results, 200, { 'Cache-Control': cacheControl });
}

export async function onRequestPost({ env, request }) {
  const user = await getUserFromRequest(request, env.DB);
  if (!user || !user.is_admin) return err('Admin only', 403);
  const { title, description, bunny_video_id, thumbnail_url, duration_seconds, tag, orientation } = await request.json();
  if (!title || !bunny_video_id) return err('Title and Bunny video ID required');
  const safeDuration = Number.isFinite(duration_seconds) && duration_seconds > 0 ? Math.floor(duration_seconds) : 0;
  const safeOrientation = orientation === 'vertical' ? 'vertical' : 'landscape';
  const { meta } = await env.DB.prepare(
    'INSERT INTO videos (title, description, bunny_video_id, thumbnail_url, duration_seconds, tag, orientation, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  ).bind(title, description || '', bunny_video_id, thumbnail_url || '', safeDuration, (tag || '').slice(0, 60), safeOrientation, Date.now()).run();
  return json({ id: meta.last_row_id, title, bunny_video_id, duration_seconds: safeDuration, tag: (tag || '').slice(0, 60), orientation: safeOrientation }, 201);
}
