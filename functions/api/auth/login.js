import { hashPassword, randomToken, sessionCookie, json, err } from './_helpers.js';

export async function onRequestPost({ env, request }) {
  const { email, password } = await request.json();
  if (!email || !password) return err('Email and password required');
  const user = await env.DB.prepare(
    'SELECT id, name, email, avatar_url, is_admin, is_banned, password_hash FROM users WHERE email = ?'
  ).bind(email.toLowerCase().trim()).first();
  if (!user) return err('Invalid email or password', 401);
  if (user.is_banned) return err('This account has been suspended', 403);
  const hash = await hashPassword(password);
  if (hash !== user.password_hash) return err('Invalid email or password', 401);
  const token = randomToken();
  await env.DB.prepare(
    'INSERT INTO sessions (token, user_id, created_at) VALUES (?, ?, ?)'
  ).bind(token, user.id, Date.now()).run();
  return json({ id: user.id, name: user.name, email: user.email, avatar_url: user.avatar_url, is_admin: user.is_admin }, 200, { 'Set-Cookie': sessionCookie(token) });
}
