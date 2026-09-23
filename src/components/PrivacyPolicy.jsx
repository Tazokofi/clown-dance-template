import { useEffect } from "react";
import { Link } from "react-router-dom";
import { SITE } from "../config.js";

// Bump this by hand whenever the policy text below actually changes --
// it's not auto-generated from today's date, so it stays meaningful.
const LAST_UPDATED = "September 22, 2026";

const SECTIONS = [
  { id: "collect", title: "1. What information do we collect?" },
  { id: "process", title: "2. How do we process your information?" },
  { id: "legal-bases", title: "3. What legal bases do we rely on?" },
  { id: "share", title: "4. When and with whom do we share your information?" },
  { id: "third-party", title: "5. What's our stance on third-party websites?" },
  { id: "cookies", title: "6. Do we use cookies and other tracking technologies?" },
  { id: "retention", title: "7. How long do we keep your information?" },
  { id: "security", title: "8. How do we keep your information safe?" },
  { id: "minors", title: "9. Do we collect information from minors?" },
  { id: "rights", title: "10. What are your privacy rights?" },
  { id: "dnt", title: "11. Controls for Do-Not-Track features" },
  { id: "us-residents", title: "12. Do US residents have specific privacy rights?" },
  { id: "updates", title: "13. Do we make updates to this notice?" },
  { id: "contact", title: "14. How can you contact us about this notice?" },
  { id: "review", title: "15. How can you review, update, or delete your data?" },
];

// ── Privacy Policy ───────────────────────────────────────
export default function PrivacyPolicy() {
  useEffect(() => {
    document.title = `Privacy Policy — ${SITE.nameMain} ${SITE.nameAccent} ${SITE.nameSuffix}`;
  }, []);

  const siteName = `${SITE.nameMain} ${SITE.nameAccent} ${SITE.nameSuffix}`;
  const hostname = typeof window !== 'undefined' && window.location.hostname ? window.location.hostname : siteName;

  return (
    <div className="page privacy-page" style={{ '--accent': SITE.accentColor, '--accent-hover': SITE.accentColorHover }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,700;9..144,900&family=Inter:wght@400;500;600&display=swap');
        .privacy-page, .privacy-page *, .privacy-page *::before, .privacy-page *::after { box-sizing: border-box; }
        .privacy-page { background: #0a0a0a; color: #f5f5f5; font-family: 'Inter', sans-serif; min-height: 100vh; padding: 48px 32px 80px; margin: 0; }
        .privacy-wrap { max-width: 760px; margin: 0 auto; }
        .privacy-back { display: inline-flex; align-items: center; gap: 6px; color: #8a8a8a; text-decoration: none; font-size: 13px; margin-bottom: 28px; }
        .privacy-back:hover { color: var(--accent); }
        .privacy-h1 { font-family: 'Fraunces', serif; font-weight: 900; font-size: clamp(28px,4vw,40px); line-height: 1.15; margin: 0 0 8px; }
        .privacy-updated { color: #8a8a8a; font-size: 13px; margin-bottom: 28px; }
        .privacy-intro { color: #c8c8c8; font-size: 14px; line-height: 1.7; margin-bottom: 32px; }
        .privacy-toc { background: #141414; border: 1px solid #1e1e1e; border-radius: 8px; padding: 18px 20px; margin-bottom: 40px; }
        .privacy-toc h2 { font-family: 'Fraunces', serif; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; color: #8a8a8a; margin: 0 0 10px; }
        .privacy-toc ol { margin: 0; padding-left: 18px; columns: 1; }
        .privacy-toc li { font-size: 13px; line-height: 1.9; }
        .privacy-toc a { color: #c8c8c8; text-decoration: none; }
        .privacy-toc a:hover { color: var(--accent); }
        .privacy-section { margin-bottom: 36px; scroll-margin-top: 24px; }
        .privacy-section h2 { font-family: 'Fraunces', serif; font-size: 20px; font-weight: 700; margin: 0 0 12px; }
        .privacy-section h3 { font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 700; margin: 18px 0 8px; color: #f5f5f5; }
        .privacy-section p { color: #c8c8c8; font-size: 14px; line-height: 1.75; margin: 0 0 12px; }
        .privacy-section ul { margin: 0 0 12px; padding-left: 20px; color: #c8c8c8; font-size: 14px; line-height: 1.8; }
        .privacy-section a { color: var(--accent); }
        .privacy-note { background: rgba(var(--accent-rgb,229,35,27),0.08); border: 1px solid rgba(229,35,27,0.25); border-radius: 6px; padding: 12px 14px; font-size: 13px; color: #d0d0d0; line-height: 1.6; margin: 0 0 12px; }
        .privacy-table { width: 100%; border-collapse: collapse; margin: 4px 0 16px; font-size: 13px; }
        .privacy-table th, .privacy-table td { border: 1px solid #1e1e1e; padding: 8px 10px; text-align: left; vertical-align: top; color: #c8c8c8; }
        .privacy-table th { background: #141414; color: #f5f5f5; font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: 0.03em; }
        .privacy-table td.yn { text-align: center; font-weight: 700; white-space: nowrap; }
        .privacy-footer-note { margin-top: 48px; padding-top: 24px; border-top: 1px solid #1e1e1e; color: #555; font-size: 12px; text-align: center; }
        @media (max-width: 640px) {
          .privacy-page { padding: 32px 18px 60px; }
        }
      `}</style>

      <div className="privacy-wrap">
        <Link to="/" className="privacy-back">← Back to {siteName}</Link>

        <h1 className="privacy-h1">Privacy Policy</h1>
        <p className="privacy-updated">Last updated {LAST_UPDATED}</p>

        <p className="privacy-intro">
          This Privacy Policy explains how {siteName} ("we," "us," or "our") collects, uses, and
          protects your information when you use this website, including when you create an
          account, watch videos, leave comments, or contact us. If you don't agree with this
          policy, please don't use the site.
        </p>

        <nav className="privacy-toc" aria-label="Table of contents">
          <h2>On this page</h2>
          <ol>
            {SECTIONS.map(s => (
              <li key={s.id}><a href={`#${s.id}`}>{s.title}</a></li>
            ))}
          </ol>
        </nav>

        <section className="privacy-section" id="collect">
          <h2>{SECTIONS[0].title}</h2>
          <h3>Information you give us directly</h3>
          <p>We collect information you choose to provide:</p>
          <ul>
            <li><strong>Creating an account</strong> — your name, email address, and password (stored as a salted hash, never in plain text).</li>
            <li><strong>Using the contact form</strong> — your name, email address, and whatever message you send us.</li>
            <li><strong>Commenting</strong> — the text of your comments, tied to your account.</li>
          </ul>
          <h3>Information collected automatically</h3>
          <ul>
            <li><strong>Anonymous view counting</strong> — if you're not signed in, we generate a random device identifier and store it in your browser's local storage, so a single visitor watching a video repeatedly doesn't inflate the view count. It isn't tied to your name or email.</li>
          </ul>
          <p>We don't collect phone numbers, mailing or billing addresses, job titles, or payment/card details — the site never asks for them. The "Tip Jar" button sends you to an external payment page (Stripe or similar) that we don't operate and never see your payment details through.</p>
        </section>

        <section className="privacy-section" id="process">
          <h2>{SECTIONS[1].title}</h2>
          <p>We process your information to:</p>
          <ul>
            <li>Create and manage your account, and keep you signed in.</li>
            <li>Show your comments and let you like, reply to, and report other comments.</li>
            <li>Respond to messages sent through the contact form.</li>
            <li>Prevent abuse — for example, rate-limiting repeated login or signup attempts.</li>
            <li>Comply with legal obligations, if we're ever required to.</li>
          </ul>
        </section>

        <section className="privacy-section" id="legal-bases">
          <h2>{SECTIONS[2].title}</h2>
          <p>If you're in the EU, UK, or Canada, data protection law requires us to identify the legal basis we rely on to process your information. In practice, that basis is almost always your <strong>consent</strong> — you choose to create an account, leave a comment, or send us a message. Where relevant, we may also rely on a <strong>legitimate interest</strong> (such as preventing spam or abuse) or a <strong>legal obligation</strong> (such as responding to a lawful request from an authority).</p>
        </section>

        <section className="privacy-section" id="share">
          <h2>{SECTIONS[3].title}</h2>
          <p>We don't sell or rent your information to anyone. We share it only with the service providers that make the site work, each bound by their own terms:</p>
          <ul>
            <li><strong>Cloudflare</strong> — hosting, and the database that stores accounts, comments, and video metadata.</li>
            <li><strong>Bunny.net</strong> — video hosting and streaming.</li>
            <li><strong>Resend</strong> — delivers contact-form messages to us by email.</li>
          </ul>
          <p>We may also disclose information if required by law, or if the site is ever sold or transferred (in which case your information would transfer as part of that deal, under this same policy or one you're notified of).</p>
        </section>

        <section className="privacy-section" id="third-party">
          <h2>{SECTIONS[4].title}</h2>
          <p>This site links out to other platforms (YouTube, TikTok, X, Rumble, Odysee, Signal, and similar). We don't control those sites and aren't responsible for their privacy practices — check their own policies before sharing information with them.</p>
        </section>

        <section className="privacy-section" id="cookies">
          <h2>{SECTIONS[5].title}</h2>
          <p>We use one first-party <strong>session cookie</strong> when you sign in, so the site knows it's you on later visits. It's essential to keep you logged in and isn't used for advertising or tracking across other sites.</p>
          <p>We also store a random device identifier in your browser's local storage (not a cookie) purely to avoid double-counting anonymous video views, as described above.</p>
          <p>We don't currently use any third-party analytics, advertising, or tracking cookies.</p>
        </section>

        <section className="privacy-section" id="retention">
          <h2>{SECTIONS[6].title}</h2>
          <p>We keep your account information for as long as your account exists. If you ask us to delete your account (see "How can you review, update, or delete your data?" below), we delete your personal information and reassign your past comments to a generic "Deleted user" placeholder, so replies to them still make sense — nothing left behind is tied back to you personally. Contact-form messages are kept only as long as needed to respond to you.</p>
        </section>

        <section className="privacy-section" id="security">
          <h2>{SECTIONS[7].title}</h2>
          <p>We use reasonable technical safeguards to protect your information — for example, passwords are salted and hashed, not stored in plain text, and traffic to the site is encrypted (HTTPS). That said, no method of transmission or storage is 100% secure, and we can't guarantee absolute security.</p>
        </section>

        <section className="privacy-section" id="minors">
          <h2>{SECTIONS[8].title}</h2>
          <p>This site isn't directed at children, and we don't knowingly collect information from anyone under 18. If you believe a child has created an account or provided us information, please contact us using the form below and we'll remove it.</p>
        </section>

        <section className="privacy-section" id="rights">
          <h2>{SECTIONS[9].title}</h2>
          <p>Depending on where you live, you may have the right to access the personal information we hold about you, correct it, request its deletion, or object to certain uses of it. You can exercise any of these rights by using the contact form linked below.</p>
          <p>If you're in the UK or EEA and unhappy with how we've handled your information, you also have the right to lodge a complaint with your local data protection authority (in the UK, the <a href="https://ico.org.uk/make-a-complaint" target="_blank" rel="noopener noreferrer">Information Commissioner's Office</a>).</p>
        </section>

        <section className="privacy-section" id="dnt">
          <h2>{SECTIONS[10].title}</h2>
          <p>Some browsers offer a "Do Not Track" signal. There's currently no industry-standard way sites are expected to respond to it, so we don't respond to DNT signals differently — but as noted above, we don't run third-party tracking anyway.</p>
        </section>

        <section className="privacy-section" id="us-residents">
          <h2>{SECTIONS[11].title}</h2>
          <p>If you're a California resident (or a resident of a state with a similar law), here's how your information maps to the categories those laws use:</p>
          <table className="privacy-table">
            <thead>
              <tr><th>Category</th><th>Examples</th><th>Collected?</th></tr>
            </thead>
            <tbody>
              <tr><td>A. Identifiers</td><td>Name, email address, account username</td><td className="yn">Yes</td></tr>
              <tr><td>B. California Customer Records categories</td><td>Name and contact information</td><td className="yn">Yes</td></tr>
              <tr><td>C. Protected classification characteristics</td><td>Age, race, gender, etc.</td><td className="yn">No</td></tr>
              <tr><td>D. Commercial information</td><td>Purchase history, payment info</td><td className="yn">No</td></tr>
              <tr><td>E. Biometric information</td><td>Fingerprints, voiceprints</td><td className="yn">No</td></tr>
              <tr><td>F. Internet/network activity</td><td>Browsing history, ad interaction data</td><td className="yn">No</td></tr>
              <tr><td>G. Geolocation data</td><td>Device location</td><td className="yn">No</td></tr>
              <tr><td>H. Audio/visual information</td><td>Photos, call/video recordings</td><td className="yn">No</td></tr>
              <tr><td>I. Professional/employment information</td><td>Job title, work history</td><td className="yn">No</td></tr>
              <tr><td>J. Education information</td><td>Student records</td><td className="yn">No</td></tr>
              <tr><td>K. Inferences</td><td>Profiles built from your data</td><td className="yn">No</td></tr>
              <tr><td>L. Sensitive personal information</td><td>Government ID, precise location, health, religious/political beliefs, race/ethnicity, etc.</td><td className="yn">No</td></tr>
            </tbody>
          </table>
          <p>We keep Category A and B information for as long as you have an account with us, as described in "How long do we keep your information?" above. We haven't sold, shared, or disclosed any personal information to third parties for a business or commercial purpose, and we don't plan to.</p>
          <h3>Your rights</h3>
          <ul>
            <li>Know what personal data we're processing about you</li>
            <li>Access a copy of it</li>
            <li>Correct inaccuracies in it</li>
            <li>Request that we delete it</li>
            <li>Not be discriminated against for exercising any of these rights</li>
          </ul>
          <h3>How to exercise your rights</h3>
          <p>Use the <a href="/#contact">contact form</a> on the homepage and let us know what you'd like. We may ask you to confirm the email address on your account so we know the request is really from you. If we decline a request, you can ask us to reconsider — email us the same way and we'll explain our reasoning in writing.</p>
        </section>

        <section className="privacy-section" id="updates">
          <h2>{SECTIONS[12].title}</h2>
          <p>We may update this policy from time to time. The date at the top will change when we do, and if a change is significant, we'll post a notice on the site.</p>
        </section>

        <section className="privacy-section" id="contact">
          <h2>{SECTIONS[13].title}</h2>
          <p>The easiest way to reach us with questions, concerns, or requests about this policy is the <a href="/#contact">contact form</a> on the homepage.</p>
        </section>

        <section className="privacy-section" id="review">
          <h2>{SECTIONS[14].title}</h2>
          <p>To review, correct, or delete the personal information we have about you — including closing your account entirely — send us a message through the <a href="/#contact">contact form</a> from the email address on your account. For account deletion specifically: we'll remove your personal information and reassign any comments you've posted to a generic "Deleted user" placeholder so discussion threads stay readable, without anything left pointing back to you.</p>
        </section>

        <p className="privacy-footer-note">This policy covers {hostname}. Have questions? <a href="/#contact">Get in touch</a>.</p>
      </div>
    </div>
  );
}
