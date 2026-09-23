import { useEffect } from "react";
import { Link } from "react-router-dom";
import { SITE } from "../config.js";

// Bump this by hand whenever the terms text below actually changes.
const LAST_UPDATED = "September 23, 2026";

const SECTIONS = [
  { id: "services", title: "1. Our services" },
  { id: "ip", title: "2. Intellectual property rights" },
  { id: "representations", title: "3. User representations" },
  { id: "prohibited", title: "4. Prohibited activities" },
  { id: "contributions", title: "5. User-generated contributions" },
  { id: "license", title: "6. Contribution license" },
  { id: "management", title: "7. Services management" },
  { id: "termination", title: "8. Term and termination" },
  { id: "modifications", title: "9. Modifications and interruptions" },
  { id: "law", title: "10. Governing law" },
  { id: "disputes", title: "11. Dispute resolution" },
  { id: "corrections", title: "12. Corrections" },
  { id: "disclaimer", title: "13. Disclaimer" },
  { id: "liability", title: "14. Limitations of liability" },
  { id: "indemnification", title: "15. Indemnification" },
  { id: "userdata", title: "16. User data" },
  { id: "electronic", title: "17. Electronic communications, transactions, and signatures" },
  { id: "misc", title: "18. Miscellaneous" },
  { id: "contact", title: "19. Contact us" },
];

// ── Terms of Use ──────────────────────────────────────────
export default function TermsOfUse() {
  useEffect(() => {
    document.title = `Terms of Use — ${SITE.nameMain} ${SITE.nameAccent} ${SITE.nameSuffix}`;
  }, []);

  const siteName = `${SITE.nameMain} ${SITE.nameAccent} ${SITE.nameSuffix}`;

  return (
    <div className="page terms-page" style={{ '--accent': SITE.accentColor, '--accent-hover': SITE.accentColorHover }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,700;9..144,900&family=Inter:wght@400;500;600&display=swap');
        .terms-page, .terms-page *, .terms-page *::before, .terms-page *::after { box-sizing: border-box; }
        .terms-page { background: #0a0a0a; color: #f5f5f5; font-family: 'Inter', sans-serif; min-height: 100vh; padding: 48px 32px 80px; margin: 0; }
        .terms-wrap { max-width: 760px; margin: 0 auto; }
        .terms-back { display: inline-flex; align-items: center; gap: 6px; color: #8a8a8a; text-decoration: none; font-size: 13px; margin-bottom: 28px; }
        .terms-back:hover { color: var(--accent); }
        .terms-h1 { font-family: 'Fraunces', serif; font-weight: 900; font-size: clamp(28px,4vw,40px); line-height: 1.15; margin: 0 0 8px; }
        .terms-updated { color: #8a8a8a; font-size: 13px; margin-bottom: 28px; }
        .terms-intro { color: #c8c8c8; font-size: 14px; line-height: 1.7; margin-bottom: 32px; }
        .terms-toc { background: #141414; border: 1px solid #1e1e1e; border-radius: 8px; padding: 18px 20px; margin-bottom: 40px; }
        .terms-toc h2 { font-family: 'Fraunces', serif; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; color: #8a8a8a; margin: 0 0 10px; }
        .terms-toc ol { margin: 0; padding-left: 18px; }
        .terms-toc li { font-size: 13px; line-height: 1.9; }
        .terms-toc a { color: #c8c8c8; text-decoration: none; }
        .terms-toc a:hover { color: var(--accent); }
        .terms-section { margin-bottom: 36px; scroll-margin-top: 24px; }
        .terms-section h2 { font-family: 'Fraunces', serif; font-size: 20px; font-weight: 700; margin: 0 0 12px; }
        .terms-section h3 { font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 700; margin: 18px 0 8px; color: #f5f5f5; }
        .terms-section p { color: #c8c8c8; font-size: 14px; line-height: 1.75; margin: 0 0 12px; }
        .terms-section ul { margin: 0 0 12px; padding-left: 20px; color: #c8c8c8; font-size: 14px; line-height: 1.8; }
        .terms-section a { color: var(--accent); }
        .terms-footer-note { margin-top: 48px; padding-top: 24px; border-top: 1px solid #1e1e1e; color: #555; font-size: 12px; text-align: center; }
        @media (max-width: 640px) {
          .terms-page { padding: 32px 18px 60px; }
        }
      `}</style>

      <div className="terms-wrap">
        <Link to="/" className="terms-back">← Back to {siteName}</Link>

        <h1 className="terms-h1">Terms of Use</h1>
        <p className="terms-updated">Last updated {LAST_UPDATED}</p>

        <p className="terms-intro">
          These Terms of Use are a binding agreement between you and {siteName} ("we," "us," or "our")
          covering your access to and use of this website. By using the site — watching videos, creating
          an account, or leaving a comment — you agree to these terms. If you don't agree, please don't
          use the site. We may update these terms from time to time; the date above will change when we do.
        </p>

        <nav className="terms-toc" aria-label="Table of contents">
          <h2>On this page</h2>
          <ol>
            {SECTIONS.map(s => (
              <li key={s.id}><a href={`#${s.id}`}>{s.title}</a></li>
            ))}
          </ol>
        </nav>

        <section className="terms-section" id="services">
          <h2>{SECTIONS[0].title}</h2>
          <p>This site is intended for general audiences and isn't directed at any particular country. If you access it from somewhere its content would be restricted or unlawful, that's on you — use your own judgment about local laws that might apply.</p>
        </section>

        <section className="terms-section" id="ip">
          <h2>{SECTIONS[1].title}</h2>
          <h3>Our content</h3>
          <p>Everything on this site — videos, text, photos, graphics, design, and the {siteName} name and logo — belongs to us or is used with permission, and is protected by copyright and trademark law. It's provided "as is" for your personal, non-commercial viewing only.</p>
          <h3>What you can do with it</h3>
          <p>You're welcome to view the site and download or print a copy of anything you can already see, for your own personal, non-commercial use. Beyond that — republishing, redistributing, or using anything from the site commercially — needs our written permission first. To ask, use the <a href="/#contact">contact form</a>. If we do grant permission, you'll need to credit us and keep our copyright notice visible.</p>
          <h3>What you submit to us</h3>
          <p>If you send us a question, suggestion, or feedback through the contact form (outside of a regular comment — see the next section for those), you're giving us the right to use it however we want, without owing you anything for it. Don't send us anything you don't have the rights to share, or that's meant to stay confidential — and please don't send anything illegal, harassing, hateful, obscene, or deliberately false. You're responsible for what you submit, and for any trouble it causes.</p>
        </section>

        <section className="terms-section" id="representations">
          <h2>{SECTIONS[2].title}</h2>
          <p>By using the site, you're confirming that: you're legally able to agree to these terms; you're not a minor where you live; you won't access the site through bots, scripts, or other automated means; and you won't use the site for anything illegal or unauthorized. If anything you tell us (like your account info) turns out to be false or outdated, we can suspend or close your account.</p>
        </section>

        <section className="terms-section" id="prohibited">
          <h2>{SECTIONS[3].title}</h2>
          <p>Please don't use the site for anything other than its intended purpose — watching, commenting, and reaching out. Specifically, don't:</p>
          <ul>
            <li>Scrape or systematically collect data or content from the site.</li>
            <li>Try to trick or defraud us or other users, including phishing for account passwords.</li>
            <li>Bypass or interfere with any security features of the site.</li>
            <li>Use anything you learn here to harass, abuse, or harm someone else.</li>
            <li>Spam, flood, or post excessive repetitive content, or upload viruses or malicious code.</li>
            <li>Use bots, scripts, or automated tools to post comments or otherwise interact with the site.</li>
            <li>Impersonate another user, or use someone else's account.</li>
            <li>Try to reverse-engineer, decompile, or copy the site's underlying code.</li>
            <li>Scrape emails or usernames to send unsolicited messages, or create accounts by automated means or under false pretenses.</li>
            <li>Use the site to compete with us or for your own commercial gain.</li>
          </ul>
        </section>

        <section className="terms-section" id="contributions">
          <h2>{SECTIONS[4].title}</h2>
          <p>You can leave comments on videos and in the site's discussion thread. When you do, you're confirming that your comment is your own original content (or you have the right to share it), that it doesn't violate anyone else's rights, and that it doesn't break the rules in the "Prohibited activities" section above. Comments are visible to other visitors, and we can remove, hide, or pin any comment at our discretion.</p>
        </section>

        <section className="terms-section" id="license">
          <h2>{SECTIONS[5].title}</h2>
          <p>We don't claim ownership of your comments — they're still yours. But by posting one, you're giving us permission to store, display, and moderate it as part of running the site. We're not responsible for anything you say in a comment, and you're solely responsible for it.</p>
          <p>If you send us suggestions or feedback about the site, we can use that feedback however we want without owing you anything for it.</p>
        </section>

        <section className="terms-section" id="management">
          <h2>{SECTIONS[6].title}</h2>
          <p>We can monitor the site for rule-breaking, remove or restrict content (including your comments) at our discretion, and take action — including reporting someone to the authorities — if we believe the law or these terms have been violated. We run the site the way we see fit to keep it working properly.</p>
        </section>

        <section className="terms-section" id="termination">
          <h2>{SECTIONS[7].title}</h2>
          <p>We can deny access to the site, suspend or close your account, or remove your content at any time, for any reason (or no reason), without notice — including for breaking these terms. If we close your account, you're not allowed to create a new one to get around it.</p>
        </section>

        <section className="terms-section" id="modifications">
          <h2>{SECTIONS[8].title}</h2>
          <p>We can change, update, or remove anything on the site at any time, and we don't guarantee the site will always be available — there may be downtime for maintenance or things outside our control. We're not liable for any inconvenience that causes.</p>
        </section>

        <section className="terms-section" id="law">
          <h2>{SECTIONS[9].title}</h2>
          <p>These terms are governed by the laws of the Commonwealth of Massachusetts, USA, without regard to conflict-of-law principles, and any dispute will be handled in the courts of Massachusetts.</p>
        </section>

        <section className="terms-section" id="disputes">
          <h2>{SECTIONS[10].title}</h2>
          <h3>Let's talk first</h3>
          <p>If a dispute comes up, we'd both agree to try to work it out informally first — starting with a written notice from whichever of us raises it, and at least 30 days to talk before anything more formal.</p>
          <h3>If that doesn't work</h3>
          <p>Any dispute that can't be resolved informally will be settled by binding arbitration with a single arbitrator, seated in Boston, Massachusetts, conducted in English, under Massachusetts law. Arbitration is limited to the dispute between us individually — no class actions or representative claims. This doesn't apply to disputes about intellectual property, unauthorized use, or requests for injunctive relief, which can go straight to court.</p>
        </section>

        <section className="terms-section" id="corrections">
          <h2>{SECTIONS[11].title}</h2>
          <p>There may be occasional errors or typos on the site. We can correct them, or update any information, at any time without notice.</p>
        </section>

        <section className="terms-section" id="disclaimer">
          <h2>{SECTIONS[12].title}</h2>
          <p>The site is provided "as is," at your own risk. We don't guarantee it'll be error-free, uninterrupted, secure, or accurate, and we're not responsible for problems caused by your use of the site, unauthorized access to it, viruses transmitted through it, or content posted by other users or linked third-party sites. Use good judgment, especially with anything you access through outside links (like the Tip Jar).</p>
        </section>

        <section className="terms-section" id="liability">
          <h2>{SECTIONS[13].title}</h2>
          <p>To the extent the law allows, we're not liable for any indirect, incidental, or consequential damages arising from your use of the site — and since nothing on the site costs money, our total liability to you for any claim is limited to whatever (if anything) you've paid us, which for virtually everyone will be zero. Some places don't allow liability limits like this, so depending on where you live, some of this may not apply to you.</p>
        </section>

        <section className="terms-section" id="indemnification">
          <h2>{SECTIONS[14].title}</h2>
          <p>If a third party makes a claim against us because of something you did — using the site improperly, breaking these terms, violating someone else's rights, or harming another user — you agree to cover our reasonable costs and cooperate with us in defending against it.</p>
        </section>

        <section className="terms-section" id="userdata">
          <h2>{SECTIONS[15].title}</h2>
          <p>We keep the data needed to run the site (your account, comments, and similar). We do routine backups, but you're responsible for anything you post or transmit, and we're not liable for any loss or corruption of that data.</p>
        </section>

        <section className="terms-section" id="electronic">
          <h2>{SECTIONS[16].title}</h2>
          <p>By using the site, you agree that we can communicate with you electronically (like by email), and that counts as "in writing" for any legal purpose. You're waiving any requirement for a physical signature or paper record.</p>
        </section>

        <section className="terms-section" id="misc">
          <h2>{SECTIONS[17].title}</h2>
          <p>These terms are the whole agreement between us about the site. If we don't enforce a provision, that doesn't waive our right to enforce it later. If any part of these terms turns out to be unenforceable, the rest still stands. Using the site doesn't make us business partners or employer/employee — you're just a visitor, and we're just the site.</p>
        </section>

        <section className="terms-section" id="contact">
          <h2>{SECTIONS[18].title}</h2>
          <p>Questions about these terms, or a complaint about the site? Use the <a href="/#contact">contact form</a> on the homepage.</p>
        </section>

        <p className="terms-footer-note">See also our <Link to="/privacy">Privacy Policy</Link>.</p>
      </div>
    </div>
  );
}
