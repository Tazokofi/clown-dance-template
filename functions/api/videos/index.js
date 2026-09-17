import { getUserFromRequest, json, err } from '../auth/_helpers.js';

export async function onRequestGet({ env, request }) {
  const user = await getUserFromRequest(request, env.DB);
  const { results } = await env.DB.prepare(
    `SELECT v.id, v.title, v.description, v.bunny_video_id, v.thumbnail_url,
            v.view_count, v.like_count, v.dislike_count, v.comment_count, v.created_at
            ${user ? `, (SELECT vote FROM video_votes WHERE video_id = v.id AND user_id = ${user.id}) as my_vote` : ', NULL as my_vote'}
     FROM videos v ORDER BY v.created_at DESC`
  ).all();
  return json(results);
}

export async function onRequestPost({ env, request }) {
  const user = await getUserFromRequest(request, env.DB);
  if (!user || !user.is_admin) return err('Admin only', 403);
  const { title, description, bunny_video_id, thumbnail_url } = await request.json();
  if (!title || !bunny_video_id) return err('Title and Bunny video ID required');
  const { meta } = await env.DB.prepare(
    'INSERT INTO videos (title, description, bunny_video_id, thumbnail_url, created_at) VALUES (?, ?, ?, ?, ?)'
  ).bind(title, description || '', bunny_video_id, thumbnail_url || '', Date.now()).run();
  return json({ id: meta.last_row_id, title, bunny_video_id }, 201);
}
