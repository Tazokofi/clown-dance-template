import { getUserFromRequest, json, err } from '../auth/_helpers.js';

const PRESET_COUNT = 10;
const PRESET_AVATARS = new Set(
  Array.from({ length: PRESET_COUNT }, (_, i) => `/avatar-presets/avatar-${String(i + 1).padStart(2, '0')}.svg`)
);

export async function onRequestPost({ env, request }) {
  const user = await getUserFromRequest(request, env.DB);
  if (!user) return err('Not authenticated', 401);
  if (user.is_banned) return err('Account suspended', 403);

  const body = await request.json().catch(() => null);
  const avatar_url = body?.avatar_url;
  if (!avatar_url || !PRESET_AVATARS.has(avatar_url)) return err('Invalid avatar selection');

  await env.DB.prepare('UPDATE users SET avatar_url = ? WHERE id = ?').bind(avatar_url, user.id).run();
  return json({ avatar_url });
}
