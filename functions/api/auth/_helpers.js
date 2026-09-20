function bytesToHex(bytes) {
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

function hexToBytes(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
  return bytes;
}

function randomHex(byteLength = 32) {
  const arr = new Uint8Array(byteLength);
  crypto.getRandomValues(arr);
  return bytesToHex(arr);
}

export const randomToken = randomHex;
export const newSalt = () => randomHex(16);

const PBKDF2_ITERATIONS = 100000;

// Salted PBKDF2 (SHA-256, 100k iterations) via the Workers-native SubtleCrypto API.
// Requires a per-user salt (see newSalt()) — never hash a password without one.
export async function hashPassword(password, saltHex) {
  const keyMaterial = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']
  );
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: hexToBytes(saltHex), iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
    keyMaterial, 256
  );
  return bytesToHex(new Uint8Array(bits));
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

// ── Simple DB-backed rate limiting for auth endpoints ──────────────
// Counts rows in auth_attempts for a given (kind, identifier) within a
// sliding window. Callers decide what counts as an "attempt" to record
// (e.g. only failed logins, but every signup POST).
const RATE_LIMIT_WINDOWS_MS = { login: 15 * 60 * 1000, signup: 60 * 60 * 1000 };
const RATE_LIMIT_MAX_ATTEMPTS = { login: 5, signup: 5 };

export async function isRateLimited(DB, kind, identifier) {
  const windowMs = RATE_LIMIT_WINDOWS_MS[kind];
  const max = RATE_LIMIT_MAX_ATTEMPTS[kind];
  const since = Date.now() - windowMs;
  const row = await DB.prepare(
    'SELECT COUNT(*) as n FROM auth_attempts WHERE kind = ? AND identifier = ? AND created_at > ?'
  ).bind(kind, identifier, since).first();
  return (row?.n || 0) >= max;
}

export async function recordAttempt(DB, kind, identifier) {
  await DB.prepare(
    'INSERT INTO auth_attempts (kind, identifier, created_at) VALUES (?, ?, ?)'
  ).bind(kind, identifier, Date.now()).run();
}
