import { useState } from "react";
import { api } from "../utils.js";

// ── Auth Panel ─────────────────────────────────────────
export default function AuthPanel({ onAuthed }) {
  const [mode, setMode] = useState('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault(); setBusy(true); setError(null);
    try {
      const user = mode === 'signup'
        ? await api('/api/auth/signup', { method:'POST', body: JSON.stringify({name,email,password}) })
        : await api('/api/auth/login',  { method:'POST', body: JSON.stringify({email,password}) });
      onAuthed(user);
    } catch(e) { setError(e.message); }
    finally { setBusy(false); }
  }

  return (
    <div className="auth-panel">
      <p className="auth-note">Sign in to join the conversation.</p>
      <div className="auth-tabs">
        <button className={mode==='signin'?'active':''} onClick={()=>setMode('signin')} type="button">Sign in</button>
        <button className={mode==='signup'?'active':''} onClick={()=>setMode('signup')} type="button">Create account</button>
      </div>
      <form className="auth-form" onSubmit={submit}>
        {mode==='signup' && <input type="text" placeholder="Display name" value={name} onChange={e=>setName(e.target.value)} maxLength={40} required />}
        <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
        <input type="password" placeholder="Password (8+ characters)" value={password} onChange={e=>setPassword(e.target.value)} minLength={8} required />
        <button type="submit" disabled={busy}>{busy?'…':mode==='signup'?'Create account':'Sign in'}</button>
        {error && <p className="form-error">{error}</p>}
      </form>
    </div>
  );
}
