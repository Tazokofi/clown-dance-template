import { useState } from "react";
import { api, bunnyThumb, parseDuration } from "../utils.js";

// ── Admin: Add Video Panel ─────────────────────────────
export default function AddVideoPanel({ onAdded }) {
  const [title, setTitle]       = useState('');
  const [desc, setDesc]         = useState('');
  const [vid, setVid]           = useState('');
  const [duration, setDuration] = useState('');
  const [tag, setTag]           = useState('');
  const [orientation, setOrientation] = useState('landscape');
  const [busy, setBusy]         = useState(false);
  const [error, setError]       = useState(null);

  async function submit(e) {
    e.preventDefault(); setBusy(true); setError(null);
    try {
      const video = await api('/api/videos', { method:'POST', body: JSON.stringify({
        title, description: desc, bunny_video_id: vid.trim(),
        thumbnail_url: bunnyThumb(vid.trim()),
        duration_seconds: parseDuration(duration),
        tag: tag.trim(),
        orientation
      })});
      onAdded(video);
      setTitle(''); setDesc(''); setVid(''); setDuration(''); setTag(''); setOrientation('landscape');
    } catch(e) { setError(e.message); }
    finally { setBusy(false); }
  }

  return (
    <div className="add-video-panel">
      <h3 style={{margin:'0 0 12px',fontSize:15}}>+ Add Video</h3>
      <form onSubmit={submit} style={{display:'flex',flexDirection:'column',gap:8}}>
        <input type="text" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} required />
        <input type="text" placeholder="Description (optional)" value={desc} onChange={e=>setDesc(e.target.value)} />
        <input type="text" placeholder="Bunny Video ID (e.g. abc123-...)" value={vid} onChange={e=>setVid(e.target.value)} required />
        <input type="text" placeholder="Duration (mm:ss, e.g. 3:45)" value={duration} onChange={e=>setDuration(e.target.value)} />
        <input type="text" placeholder="Tag (optional, e.g. Convos / Monologues)" value={tag} onChange={e=>setTag(e.target.value)} maxLength={60} />
        <select value={orientation} onChange={e=>setOrientation(e.target.value)}>
          <option value="landscape">Landscape (16:9) — main grid</option>
          <option value="vertical">Vertical (9:16) — Shorts row</option>
        </select>
        <button type="submit" disabled={busy} className="btn-primary">{busy?'Adding…':'Add video'}</button>
        {error && <p className="form-error">{error}</p>}
      </form>
    </div>
  );
}
