import { getUserFromRequest, json, err } from '../../auth/_helpers.js';

export async function onRequestPost({ params, env, request }) {
  const user = await getUserFromRequest(request, env.DB);
  if (!user) return err('Sign in to vote', 401);
  if (user.is_banned) return err('Account suspended', 403);
  const { vote } = await request.json(); // 1 = like, -1 = dislike
  if (vote !== 1 && vote !== -1) return err('Invalid vote');
  const comment_id = parseInt(params.id);

  const existing = await env.DB.prepare(
    'SELECT vote FROM comment_votes WHERE comment_id = ? AND user_id = ?'
  ).bind(comment_id, user.id).first();

  if (existing) {
    if (existing.vote === vote) {
      // Remove vote (toggle off)
      await env.DB.prepare('DELETE FROM comment_votes WHERE comment_id = ? AND user_id = ?').bind(comment_id, user.id).run();
      if (vote === 1) await env.DB.prepare('UPDATE comments SET like_count = MAX(0, like_count - 1) WHERE id = ?').bind(comment_id).run();
      else await env.DB.prepare('UPDATE comments SET dislike_count = MAX(0, dislike_count - 1) WHERE id = ?').bind(comment_id).run();
      return json({ vote: null });
    } else {
      // Switch vote
      await env.DB.prepare('UPDATE comment_votes SET vote = ? WHERE comment_id = ? AND user_id = ?').bind(vote, comment_id, user.id).run();
      if (vote === 1) {
        await env.DB.prepare('UPDATE comments SET like_count = like_count + 1, dislike_count = MAX(0, dislike_count - 1) WHERE id = ?').bind(comment_id).run();
      } else {
        await env.DB.prepare('UPDATE comments SET dislike_count = dislike_count + 1, like_count = MAX(0, like_count - 1) WHERE id = ?').bind(comment_id).run();
      }
      return json({ vote });
    }
  } else {
    // New vote
    await env.DB.prepare('INSERT INTO comment_votes (comment_id, user_id, vote, created_at) VALUES (?, ?, ?, ?)').bind(comment_id, user.id, vote, Date.now()).run();
    if (vote === 1) await env.DB.prepare('UPDATE comments SET like_count = like_count + 1 WHERE id = ?').bind(comment_id).run();
    else await env.DB.prepare('UPDATE comments SET dislike_count = dislike_count + 1 WHERE id = ?').bind(comment_id).run();
    return json({ vote });
  }
}
