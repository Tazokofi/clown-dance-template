// ── Social platform icons (inline SVG, no external requests) ──
export default function SocialIcon({ platform }) {
  switch (platform) {
    case 'youtube':
      return (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
          <path d="M23.5 6.2c-.3-1.1-1.1-1.9-2.2-2.2C19.3 3.5 12 3.5 12 3.5s-7.3 0-9.3.5c-1.1.3-1.9 1.1-2.2 2.2C0 8.2 0 12 0 12s0 3.8.5 5.8c.3 1.1 1.1 1.9 2.2 2.2 2 .5 9.3.5 9.3.5s7.3 0 9.3-.5c1.1-.3 1.9-1.1 2.2-2.2.5-2 .5-5.8.5-5.8s0-3.8-.5-5.8zM9.6 15.5V8.5l6.4 3.5-6.4 3.5z" />
        </svg>
      );
    case 'tiktok':
      return (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
          <path d="M16.6 5.82s.51.5 0 0A4.278 4.278 0 0 1 15.54 3h-3.09v12.4a2.592 2.592 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6 0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64 0 3.33 2.76 5.7 5.69 5.7 3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.24-1.48z" />
        </svg>
      );
    case 'x':
      return (
        <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
    case 'telegram':
      return (
        <svg viewBox="0 0 24 24" width="19" height="19" fill="currentColor" aria-hidden="true">
          <path d="M21.94 4.36c.28-1.17-.94-2.1-2.03-1.66L2.4 9.74c-1.2.47-1.19 2.16.02 2.62l4.29 1.61 1.66 5.31c.2.65 1.03.85 1.51.36l2.4-2.47 4.4 3.24c.83.61 2.02.17 2.25-.83l3-13.2zM8.36 13.16l9.4-6.3c.24-.16.5.15.29.34l-7.7 6.95c-.3.27-.49.63-.55 1.03l-.25 1.75-1.19-3.77z" />
        </svg>
      );
    case 'rumble':
    default:
      // Rumble's exact mark isn't reproduced here — this is a bold
      // monogram standing in for it, still visually distinct from the
      // four true logo glyphs above.
      return <span className="social-badge-text">R</span>;
  }
}
