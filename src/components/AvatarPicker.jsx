import { useState } from "react";
import { api } from "../utils.js";
import Avatar from "./Avatar.jsx";

// ── Avatar Picker ──────────────────────────────────────
// ── Avatar Picker ──────────────────────────────────────
const PRESET_AVATARS = Array.from({ length: 10 }, (_, i) => `/avatar-presets/avatar-${String(i + 1).padStart(2, '0')}.svg`);

export default function AvatarPicker({ user, onUpdated }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  async function choose(url) {
    if (busy || url === user.avatar_url) { setOpen(false); return; }
    setBusy(true); setError(null);
    try {
      const { avatar_url } = await api('/api/avatars/select', { method:'POST', body: JSON.stringify({ avatar_url: url }) });
      onUpdated({ ...user, avatar_url });
      setOpen(false);
    } catch(e) { setError(e.message); }
    finally { setBusy(false); }
  }

  return (
    <div style={{marginBottom:14}}>
      <div style={{display:'flex',alignItems:'center',gap:10}}>
        <Avatar url={user.avatar_url} name={user.name} size={40} />
        <div>
          <div style={{fontWeight:600,fontSize:13,color:'#f5f5f5'}}>{user.name}</div>
          <button className="link-btn" onClick={()=>setOpen(o=>!o)} type="button">
            {open ? 'Close' : user.avatar_url ? 'Change avatar' : 'Choose avatar'}
          </button>
          {error && <span style={{color:'var(--accent)',fontSize:11,marginLeft:6}}>{error}</span>}
        </div>
      </div>
      {open && (
        <div className="avatar-grid">
          {PRESET_AVATARS.map(url => (
            <button key={url} type="button" className={`avatar-choice${url===user.avatar_url?' selected':''}`}
              onClick={()=>choose(url)} disabled={busy} aria-label="Choose this avatar">
              <Avatar url={url} name="" size={40} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
