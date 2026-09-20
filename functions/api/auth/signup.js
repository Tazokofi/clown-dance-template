import { hashPassword, newSalt, randomToken, sessionCookie, json, err, isRateLimited, recordAttempt } from './_helpers.js';

export async function onRequestPost({ env, request }) {
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  if (await isRateLimited(env.DB, 'signup', ip)) {
    return err('Too many accounts created from this network — please try again later', 429);
  }
  await recordAttempt(env.DB, 'signup', ip);

  const { name, email, password } = await request.json();
  if (!name || !email || !password || password.length < 8)
    return err('Name, email and password (8+ chars) required');
  const password_salt = newSalt();
  const password_hash = await hashPassword(password, password_salt);
  const created_at = Date.now();
  try {
    const { meta } = await env.DB.prepare(
      'INSERT INTO users (name, email, password_hash, password_salt, created_at) VALUES (?, ?, ?, ?, ?)'
    ).bind(name.slice(0,40), email.toLowerCase().trim(), password_hash, password_salt, created_at).run();
    const token = randomToken();
    await env.DB.prepare(
      'INSERT INTO sessions (token, user_id, created_at) VALUES (?, ?, ?)'
    ).bind(token, meta.last_row_id, created_at).run();
    return json({ id: meta.last_row_id, name: name.slice(0,40), email: email.toLowerCase().trim(), avatar_url: null, is_admin: 0 }, 201, { 'Set-Cookie': sessionCookie(token) });
  } catch(e) {
    if (e.message?.includes('UNIQUE')) return err('Email already registered', 409);
    throw e;
  }
}
