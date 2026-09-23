import { useState } from "react";
import { api, bunnyThumb, formatDuration, parseDuration } from "../utils.js";

// ── Admin: Edit Video Form (shown inline inside the video modal) ──
export default function EditVideoForm({ video, onSaved, onCancel, onDeleted }) {
  const [title, setTitle]       = useState(video.title);
  const [desc, setDesc]         = useState(video.description || '');
  const [vid, setVid]           = useState(video.bunny_video_id);
  const [duration, setDuration] = useState(formatDuration(video.duration_seconds) || '');
  const [tag, setTag]           = useState(video.tag || '');
  const [busy, setBusy]         = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError]       = useState(null);

  async function handleDelete() {
    if (!confirm(`Delete "${video.title}"? It'll disappear from the site right away.`)) return;
    setDeleting(true); setError(null);
    try {
      await api(`/api/videos/${video.id}/delete`, { method:'POST' });
      onDeleted(video.id);
    } catch(e) { setError(e.message); setDeleting(false); }
  }

  async function submit(e) {
    e.preventDefault(); setBusy(true); setError(null);
    try {
      const updated = await api(`/api/videos/${video.id}/edit`, { method:'POST', body: JSON.stringify({
        title, description: desc, bunny_video_id: vid.trim(),
        thumbnail_url: bunnyThumb(vid.trim()),
        duration_seconds: parseDuration(duration),
        tag: tag.trim()
      })});
      onSaved(updated);
    } catch(e) { setError(e.message); }
    finally { setBusy(false); }
  }

  return (
    <form onSubmit={submit} className="add-video-panel" style={{margin:'10px 0 0',padding:14,maxWidth:'none'}}>
      <input type="text" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} required />
      <input type="text" placeholder="Description" value={desc} onChange={e=>setDesc(e.target.value)} style={{marginTop:8}} />
      <input type="text" placeholder="Bunny Video ID" value={vid} onChange={e=>setVid(e.target.value)} required style={{marginTop:8}} />
      <input type="text" placeholder="Duration (mm:ss)" value={duration} onChange={e=>setDuration(e.target.value)} style={{marginTop:8}} />
      <input type="text" placeholder="Tag (optional, e.g. Convos / Monologues)" value={tag} onChange={e=>setTag(e.target.value)} maxLength={60} style={{marginTop:8}} />
      <div style={{display:'flex',gap:8,marginTop:10,alignItems:'center'}}>
        <button type="submit" disabled={busy} className="btn-primary">{busy?'Saving…':'Save'}</button>
        <button type="button" className="btn-ghost" onClick={onCancel}>Cancel</button>
        <button type="button" className="link-btn" style={{color:'var(--accent)',marginLeft:'auto'}} onClick={handleDelete} disabled={deleting}>
          {deleting?'Deleting…':'Delete video'}
        </button>
      </div>
      {error && <p className="form-error" style={{marginTop:6}}>{error}</p>}
    </form>
  );
}
