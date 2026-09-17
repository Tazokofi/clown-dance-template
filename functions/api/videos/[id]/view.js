import { getUserFromRequest, json } from '../../auth/_helpers.js';

export async function onRequestPost({ env, request, params }) {
  const videoId = parseInt(params.id);
  const user = await getUserFromRequest(request, env.DB);

  if (user) {
    // Logged-in: once per user per video
    try {
      await env.DB.prepare(
        'INSERT INTO views (video_id, user_id, created_at) VALUES (?, ?, ?)'
      ).bind(videoId, user.id, Date.now()).run();
      await env.DB.prepare(
        'UPDATE videos SET view_count = view_count + 1 WHERE id = ?'
      ).bind(videoId).run();
      return json({ counted: true });
    } catch { return json({ counted: false }); }
  } else {
    // Logged-out: once per device token
    const body = await request.json().catch(() => ({}));
    const device_token = (body.device_token || '').toString().slice(0, 64);
    if (!device_token) return json({ counted: false });
    try {
      await env.DB.prepare(
        'INSERT INTO views (video_id, device_token, created_at) VALUES (?, ?, ?)'
      ).bind(videoId, device_token, Date.now()).run();
      await env.DB.prepare(
        'UPDATE videos SET view_count = view_count + 1 WHERE id = ?'
      ).bind(videoId).run();
      return json({ counted: true });
    } catch { return json({ counted: false }); }
  }
}
