export async function onRequestGet({ params, env }) {
  const key = `avatars/${params.path.join('/')}`;
  const obj = await env.AVATARS.get(key);
  if (!obj) return new Response('Not found', { status: 404 });
  const headers = new Headers();
  obj.writeHttpMetadata(headers);
  headers.set('Cache-Control', 'public, max-age=31536000');
  return new Response(obj.body, { headers });
}
