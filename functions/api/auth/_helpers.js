export function randomToken() {
  const arr = new Uint8Array(32);
  crypto.getRandomValues(arr);
  return Array.from(arr).map(b => b.toString(16).padStart(2,'0')).join('');
}

export async function hashPassword(password) {
  const data = new TextEncoder().encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2,'0')).join('');
}

export function sessionCookie(token, maxAge = 60*60*24*30) {
  return `session=${token}; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}; Path=/`;
}

export function clearCookie() {
  return `session=; HttpOnly; Secure; SameSite=Lax; Max-Age=0; Path=/`;
}

export async function getUserFromRequest(request, DB) {
  const cookie = request.headers.get('Cookie') || '';
  const match  = cookie.match(/session=([a-f0-9]{64})/);
  if (!match) return null;
  return await DB.prepare(
    'SELECT u.id, u.name, u.email, u.avatar_url, u.is_admin, u.is_banned FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token = ?'
  ).bind(match[1]).first() || null;
}

export function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status, headers: { 'Content-Type': 'application/json', ...headers }
  });
}

export function err(message, status = 400) {
  return new Response(message, { status });
}
