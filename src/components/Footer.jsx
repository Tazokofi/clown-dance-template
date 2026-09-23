import { Link } from "react-router-dom";
import { SOCIAL_LINKS, SITE } from "../config.js";
import SocialIcon from "./SocialIcon.jsx";

// ── Footer ───────────────────────────────────────────────
export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="footer-social">
        {SOCIAL_LINKS.map(s => (
          <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
            className="social-badge" aria-label={s.label} title={s.label}>
            <SocialIcon platform={s.platform} />
          </a>
        ))}
      </div>
      <p className="footer-copyright">
        © {year} {SITE.nameMain} {SITE.nameAccent} {SITE.nameSuffix} · <Link to="/privacy" className="footer-link">Privacy Policy</Link>
      </p>
    </footer>
  );
}
