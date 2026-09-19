// ── Per-site configuration ──────────────────────────────
// Editing these values (and the videos you add through the admin panel)
// is all that should be needed to spin up a differently-branded copy of
// this site for a second domain/campaign.

export const SITE = {
  nameMain: 'Clown',
  nameAccent: 'Dance',
  nameSuffix: 'Gallery',
  heading: 'This is me, dressed as a clown while dancing.',
  headingLine2: 'Please watch videos, like, and comment.',
  dateRange: 'May – July 2026',
  // Brand accent color, used throughout the site for buttons, links,
  // active states, and the "Dance" word in the logo. accentColorHover
  // is what buttons fade to on hover/press — usually the same color,
  // just ~15-20% darker.
  accentColor: '#e5231b',
  accentColorHover: '#c41d17',
  // Your Stripe Payment Link for the "Tip the Clown" button (Stripe
  // Dashboard -> Payment Links -> New -> "Customers choose what to pay").
  // Replace '#' with the real https://buy.stripe.com/... URL once you've
  // created it, or point this at a Ko-fi/BuyMeACoffee/etc. link instead.
  tipUrl: '#',
};

export const BUNNY_LIBRARY_ID = '682865';
export const BUNNY_CDN = 'vz-9436fe3b-2b8.b-cdn.net';

// How many videos show before the "View more" button appears.
export const INITIAL_VIDEOS_SHOWN = 12;

// Placeholder FAQ content — replace with your real Q&A.
export const FAQS = [
  { q: 'How often do you post new videos?', a: 'New videos go up regularly — check back often, or follow one of the links below to get notified as soon as something new is posted.' },
  { q: 'Can I use your videos or clips?', a: 'Reach out through the contact form below before reusing any footage.' },
  { q: 'Where else can I find your content?', a: 'This site mirrors what’s posted across YouTube, TikTok, X, Rumble, and Telegram — links are in the Contact section below.' },
  { q: 'How do I leave a comment?', a: 'Create a free account (top right, or under any video) and you can comment, like, and reply throughout the site.' },
];

// Placeholder social links — swap in your real profile URLs.
// `platform` picks which logo icon renders (see SocialIcon in
// ClownDanceGallery.jsx) — leave it alone unless you're adding a new
// platform.
export const SOCIAL_LINKS = [
  { label: 'YouTube', platform: 'youtube', href: '#' },
  { label: 'TikTok', platform: 'tiktok', href: '#' },
  { label: 'X / Twitter', platform: 'x', href: '#' },
  { label: 'Rumble', platform: 'rumble', href: '#' },
  { label: 'Telegram', platform: 'telegram', href: '#' },
];

// Placeholder direct-chat contact info — replace with your real Signal
// and WhatsApp details (or add/remove entries).
export const CHAT_CONTACTS = [
  { label: 'Signal', value: 'ApplePie.420', href: 'https://signal.me/#u/TGNS.420' },
  { label: 'WhatsApp', value: '+1 (987) 239-4628', href: 'https://wa.me/19872394628' },
];
