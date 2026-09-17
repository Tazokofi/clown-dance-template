import { getUserFromRequest, json, err } from '../../auth/_helpers.js';

export async function onRequestPost(context) {
  const { params, env, request } = context;
  const user = await getUserFromRequest(request, env.DB);
  if (!user) return err('Please sign in to like comments', 401);
  if (user.is_banned) return err('Account suspended', 403);

  const comment_id = parseInt(params.id);
  try {
    await env.DB.prepare(
      'INSERT INTO likes (user_id, comment_id, created_at) VALUES (?, ?, ?)'
    ).bind(user.id, comment_id, Date.now()).run();
    return json({ liked: true });
  } catch (e) {
    if (e.message?.includes('UNIQUE')) {
      await env.DB.prepare('DELETE FROM likes WHERE user_id = ? AND comment_id = ?')
        .bind(user.id, comment_id).run();
      return json({ liked: false });
    }
    throw e;
  }
}
