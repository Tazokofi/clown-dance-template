import { getUserFromRequest, json, err } from '../auth/_helpers.js';

// Admin-only: pin or unpin a top-level comment so it always shows first,
// above whatever sort order visitors have selected. Only one comment can
// be pinned at a time per thread (per video for video comments, or one
// overall for the site-wide "Join the Conversation" comments) -- pinning
// a new one automatically unpins whichever was pinned before it.
export async function onRequestPost({ env, request }) {
  const user = await getUserFromRequest(request, env.DB);
  if (!user || !user.is_admin) return err('Admin only', 403);

  const { comment_id, kind, pinned } = await request.json();
  const table = kind === 'site' ? 'site_comments' : 'comments';
  const id = parseInt(comment_id);
  if (!id) return err('comment_id required');

  const row = await env.DB.prepare(
    `SELECT id, parent_id${kind === 'site' ? '' : ', video_id'} FROM ${table} WHERE id = ?`
  ).bind(id).first();
  if (!row) return err('Comment not found', 404);
  if (pinned && row.parent_id) return err('Only top-level comments can be pinned');

  if (pinned) {
    if (kind === 'site') {
      await env.DB.prepare(`UPDATE ${table} SET is_pinned = 0 WHERE is_pinned = 1`).run();
    } else {
      await env.DB.prepare(`UPDATE ${table} SET is_pinned = 0 WHERE video_id = ? AND is_pinned = 1`).bind(row.video_id).run();
    }
  }
  await env.DB.prepare(`UPDATE ${table} SET is_pinned = ? WHERE id = ?`).bind(pinned ? 1 : 0, id).run();

  return json({ comment_id: id, pinned: !!pinned });
}
