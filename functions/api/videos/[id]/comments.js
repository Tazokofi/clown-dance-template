import { getUserFromRequest, json, err } from '../../auth/_helpers.js';

export async function onRequestGet({ params, env, request }) {
  const user = await getUserFromRequest(request, env.DB);
  const { results } = await env.DB.prepare(`
    SELECT c.id, c.parent_id, c.author, c.text, c.created_at,
           c.like_count, c.dislike_count, c.report_count,
           c.is_hidden, c.is_pinned, c.user_id,
           u.avatar_url, u.is_admin,
           ${user ? `(SELECT vote FROM comment_votes WHERE comment_id = c.id AND user_id = ${user.id}) as my_vote,
           (SELECT 1 FROM comment_reports WHERE comment_id = c.id AND user_id = ${user.id}) as my_report` : 'NULL as my_vote, NULL as my_report'}
    FROM comments c
    LEFT JOIN users u ON u.id = c.user_id
    WHERE c.video_id = ? AND c.is_deleted = 0
      AND (c.is_hidden = 0 ${user?.is_admin ? 'OR 1=1' : ''})
    ORDER BY c.created_at ASC
  `).bind(params.id).all();
  return json(results);
}

export async function onRequestPost({ params, env, request }) {
  const user = await getUserFromRequest(request, env.DB);
  if (!user) return err('Sign in to comment', 401);
  if (user.is_banned) return err('Account suspended', 403);
  const body = await request.json();
  const text = (body.text || '').toString().trim().slice(0, 500);
  const parent_id = body.parent_id ? parseInt(body.parent_id) : null;
  if (!text) return err('Comment text required');
  const created_at = Date.now();
  const { meta } = await env.DB.prepare(
    'INSERT INTO comments (video_id, user_id, parent_id, author, text, created_at) VALUES (?, ?, ?, ?, ?, ?)'
  ).bind(params.id, user.id, parent_id, user.name, text, created_at).run();
  await env.DB.prepare('UPDATE videos SET comment_count = comment_count + 1 WHERE id = ?').bind(params.id).run();
  return json({ id: meta.last_row_id, parent_id, author: user.name, avatar_url: user.avatar_url, is_admin: user.is_admin, text, created_at, like_count: 0, dislike_count: 0, report_count: 0, is_hidden: 0, is_pinned: 0, my_vote: null, my_report: null, user_id: user.id }, 201);
}
