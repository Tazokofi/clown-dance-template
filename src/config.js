// ── Per-site configuration ──────────────────────────────
// Editing these values (and the videos you add through the admin panel)
// is all that should be needed to spin up a differently-branded copy of
// this site for a second domain/campaign.

export const SITE = {
  nameMain: 'Clown',
  nameAccent: 'Dance',
  nameSuffix: 'Gallery',
  heading: 'This is me, dressed as a clown while dancing.',
  headingLine2: 'Come and join the conversation',
  dateRange: 'May – July 2026',
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
export const SOCIAL_LINKS = [
  { label: 'YouTube', initials: 'YT', href: '#' },
  { label: 'TikTok', initials: 'TT', href: '#' },
  { label: 'X / Twitter', initials: 'X', href: '#' },
  { label: 'Rumble', initials: 'RB', href: '#' },
  { label: 'Telegram', initials: 'TG', href: '#' },
];
