// ── Tip Jar Icon (inline SVG, no external requests) ────
export default function TipJarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{flexShrink:0}}>
      <rect x="9" y="3.5" width="6" height="3" rx="1" stroke="currentColor" strokeWidth="1.6"/>
      <rect x="6" y="7.5" width="12" height="13" rx="2.5" stroke="currentColor" strokeWidth="1.6"/>
      <text x="12" y="17.5" textAnchor="middle" fontSize="8" fontWeight="800" fill="currentColor" fontFamily="Arial, sans-serif">$</text>
    </svg>
  );
}
