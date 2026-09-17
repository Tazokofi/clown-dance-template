import { getUserFromRequest, json, err } from '../auth/_helpers.js';

export async function onRequestPost({ env, request }) {
  const user = await getUserFromRequest(request, env.DB);
  if (!user) return err('Not authenticated', 401);
  if (user.is_banned) return err('Account suspended', 403);
  const formData = await request.formData();
  const file = formData.get('avatar');
  if (!file || typeof file === 'string') return err('No file provided');
  const allowed = ['image/jpeg','image/png','image/webp','image/gif'];
  if (!allowed.includes(file.type)) return err('Only JPEG, PNG, WebP or GIF allowed');
  if (file.size > 2 * 1024 * 1024) return err('File too large — max 2MB');
  const ext = file.type.split('/')[1].replace('jpeg','jpg');
  const key = `avatars/${user.id}-${Date.now()}.${ext}`;
  await env.AVATARS.put(key, await file.arrayBuffer(), { httpMetadata: { contentType: file.type } });
  const avatar_url = `/avatars/${key}`;
  await env.DB.prepare('UPDATE users SET avatar_url = ? WHERE id = ?').bind(avatar_url, user.id).run();
  return json({ avatar_url });
}
