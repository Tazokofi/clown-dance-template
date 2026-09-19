import { json, err } from './auth/_helpers.js';

export async function onRequestPost({ env, request }) {
  const body = await request.json().catch(() => ({}));
  const name    = (body.name || '').toString().trim().slice(0, 100);
  const email   = (body.email || '').toString().trim().slice(0, 200);
  const message = (body.message || '').toString().trim().slice(0, 2000);
  const hp_field = (body.hp_field || '').toString();
  // Honeypot: real visitors never fill this hidden field. Bots that blindly fill
  // every input do, so pretend success without sending anything.
  if (hp_field) return json({ sent: true });
  if (!name || !email || !message) return err('Name, email and message are required');

  if (!env.RESEND_API_KEY || !env.CONTACT_TO_EMAIL) {
    return err('The contact form isn’t finished being set up yet — please try again later', 503);
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: env.CONTACT_FROM_EMAIL || 'onboarding@resend.dev',
      to: env.CONTACT_TO_EMAIL,
      reply_to: email,
      subject: `New contact form message from ${name}`,
      text: `From: ${name} <${email}>\n\n${message}`,
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    console.error('Resend error', res.status, detail);
    return err('Could not send your message right now — please try again later', 502);
  }

  return json({ sent: true });
}
