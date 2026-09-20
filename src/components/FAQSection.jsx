import { useState } from "react";
import { FAQS } from "../config.js";

// ── FAQ Section ─────────────────────────────────────────
export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);
  return (
    <section className="site-section" id="faq">
      <span className="site-section-eyebrow">FAQ</span>
      <h2 className="site-section-title">FAQs</h2>
      <div className="faq-list">
        {FAQS.map((item, i) => (
          <div key={i} className="faq-item">
            <button className="faq-question" onClick={()=>setOpenIndex(openIndex===i?null:i)} type="button">
              <span>{item.q}</span>
              <span className="faq-caret">{openIndex===i?'−':'+'}</span>
            </button>
            {openIndex===i && <p className="faq-answer">{item.a}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
