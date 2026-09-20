import { hashPassword, randomToken, sessionCookie, json, err, isRateLimited, recordAttempt } from './_helpers.js';

export async function onRequestPost({ env, request }) {
  const { email, password } = await request.json();
  if (!email || !password) return err('Email and password required');
  const identifier = email.toLowerCase().trim();

  if (await isRateLimited(env.DB, 'login', identifier)) {
    return err('Too many failed attempts — please wait 15 minutes and try again', 429);
  }

  const user = await env.DB.prepare(
    'SELECT id, name, email, avatar_url, is_admin, is_banned, password_hash, password_salt FROM users WHERE email = ?'
  ).bind(identifier).first();
  if (!user) {
    await recordAttempt(env.DB, 'login', identifier);
    return err('Invalid email or password', 401);
  }
  if (user.is_banned) return err('This account has been suspended', 403);
  if (!user.password_salt) return err('This account needs to be re-created — please sign up again', 401);
  const hash = await hashPassword(password, user.password_salt);
  if (hash !== user.password_hash) {
    await recordAttempt(env.DB, 'login', identifier);
    return err('Invalid email or password', 401);
  }
  const token = randomToken();
  await env.DB.prepare(
    'INSERT INTO sessions (token, user_id, created_at) VALUES (?, ?, ?)'
  ).bind(token, user.id, Date.now()).run();
  return json({ id: user.id, name: user.name, email: user.email, avatar_url: user.avatar_url, is_admin: user.is_admin }, 200, { 'Set-Cookie': sessionCookie(token) });
}
