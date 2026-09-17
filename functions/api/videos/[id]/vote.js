import { getUserFromRequest, json, err } from '../../auth/_helpers.js';

export async function onRequestPost({ params, env, request }) {
  const user = await getUserFromRequest(request, env.DB);
  if (!user) return err('Sign in to vote', 401);
  if (user.is_banned) return err('Account suspended', 403);

  const { vote } = await request.json(); // 1 = like, -1 = dislike
  if (vote !== 1 && vote !== -1) return err('Invalid vote');
  const video_id = parseInt(params.id);

  // Check existing vote
  const existing = await env.DB.prepare(
    'SELECT vote FROM video_votes WHERE video_id = ? AND user_id = ?'
  ).bind(video_id, user.id).first();

  if (existing) {
    if (existing.vote === vote) {
      // Toggle off
      await env.DB.prepare('DELETE FROM video_votes WHERE video_id = ? AND user_id = ?').bind(video_id, user.id).run();
      if (vote === 1) await env.DB.prepare('UPDATE videos SET like_count = MAX(0, like_count - 1) WHERE id = ?').bind(video_id).run();
      else await env.DB.prepare('UPDATE videos SET dislike_count = MAX(0, dislike_count - 1) WHERE id = ?').bind(video_id).run();
      return json({ vote: null });
    } else {
      // Switch vote
      await env.DB.prepare('UPDATE video_votes SET vote = ? WHERE video_id = ? AND user_id = ?').bind(vote, video_id, user.id).run();
      if (vote === 1) await env.DB.prepare('UPDATE videos SET like_count = like_count + 1, dislike_count = MAX(0, dislike_count - 1) WHERE id = ?').bind(video_id).run();
      else await env.DB.prepare('UPDATE videos SET dislike_count = dislike_count + 1, like_count = MAX(0, like_count - 1) WHERE id = ?').bind(video_id).run();
      return json({ vote });
    }
  } else {
    // New vote
    await env.DB.prepare('INSERT INTO video_votes (video_id, user_id, vote, created_at) VALUES (?, ?, ?, ?)').bind(video_id, user.id, vote, Date.now()).run();
    if (vote === 1) await env.DB.prepare('UPDATE videos SET like_count = like_count + 1 WHERE id = ?').bind(video_id).run();
    else await env.DB.prepare('UPDATE videos SET dislike_count = dislike_count + 1 WHERE id = ?').bind(video_id).run();
    return json({ vote });
  }
}
