import { useState } from "react";
import { SOCIAL_LINKS, CHAT_CONTACTS } from "../config.js";
import { api } from "../utils.js";
import SocialIcon from "./SocialIcon.jsx";

// ── Contact Section ─────────────────────────────────────
export default function ContactSection() {
  const [openIndex, setOpenIndex] = useState(null);
  const [name, setName]       = useState('');
  const [email, setEmail]     = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy]       = useState(false);
  const [sent, setSent]       = useState(false);
  const [error, setError]     = useState(null);
  const [hp, setHp]           = useState('');

  async function submit(e) {
    e.preventDefault(); setBusy(true); setError(null); setSent(false);
    try {
      await api('/api/contact', { method:'POST', body: JSON.stringify({ name, email, message, hp_field: hp }) });
      setSent(true); setName(''); setEmail(''); setMessage('');
    } catch(e) { setError(e.message); }
    finally { setBusy(false); }
  }

  function toggle(i) { setOpenIndex(openIndex === i ? null : i); }

  return (
    <section className="site-section" id="contact">
      <h2 className="site-section-title">Contact Me</h2>
      <div className="faq-list">
        <div className="faq-item">
          <button className="faq-question" onClick={()=>toggle(0)} type="button">
            <span>Direct Message</span>
            <span className="faq-caret">{openIndex===0?'−':'+'}</span>
          </button>
          {openIndex===0 && (
            <div className="faq-answer">
              <form className="contact-form" onSubmit={submit}>
                <input type="text" placeholder="Your name" value={name} onChange={e=>setName(e.target.value)} maxLength={100} required />
                <input type="email" placeholder="Your email" value={email} onChange={e=>setEmail(e.target.value)} required />
                <textarea placeholder="Message" rows={4} value={message} onChange={e=>setMessage(e.target.value)} maxLength={2000} required />
                <input type="text" name="website" className="hp-field" value={hp} onChange={e=>setHp(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden="true" />
                <button type="submit" className="btn-primary" disabled={busy}>{busy?'Sending…':'Send message'}</button>
                {sent && <p style={{color:'#22c55e',fontSize:13,margin:0}}>Thanks — your message has been sent.</p>}
                {error && <p className="form-error">{error}</p>}
              </form>
            </div>
          )}
        </div>

        <div className="faq-item">
          <button className="faq-question" onClick={()=>toggle(1)} type="button">
            <span>Social Media</span>
            <span className="faq-caret">{openIndex===1?'−':'+'}</span>
          </button>
          {openIndex===1 && (
            <div className="faq-answer">
              <div className="social-links">
                {SOCIAL_LINKS.map(s => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="social-row">
                    <span className="social-badge" aria-hidden="true">
                      <SocialIcon platform={s.platform} />
                    </span>
                    <span className="social-label">{s.label}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="faq-item">
          <button className="faq-question" onClick={()=>toggle(2)} type="button">
            <span>Chat with me</span>
            <span className="faq-caret">{openIndex===2?'−':'+'}</span>
          </button>
          {openIndex===2 && (
            <div className="faq-answer">
              <div className="chat-links">
                {CHAT_CONTACTS.map(c => (
                  <a key={c.label} href={c.href} target="_blank" rel="noopener noreferrer" className="chat-link">
                    <strong>{c.label}</strong>
                    <span>{c.value}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
