import { clearCookie } from './_helpers.js';
export async function onRequestPost({ request, env }) {
  const cookie = request.headers.get('Cookie') || '';
  const match = cookie.match(/session=([a-f0-9]{64})/);
  if (match) await env.DB.prepare('DELETE FROM sessions WHERE token = ?').bind(match[1]).run();
  return new Response(null, { status: 204, headers: { 'Set-Cookie': clearCookie() } });
}
