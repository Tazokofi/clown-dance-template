import { useState, useEffect, useRef, useCallback } from "react";

const BUNNY_LIBRARY_ID = "682865";
const BUNNY_CDN = "vz-9436fe3b-2b8.b-cdn.net";

function bunnyEmbed(videoId) {
  return `https://iframe.mediadelivery.net/embed/${BUNNY_LIBRARY_ID}/${videoId}?autoplay=true&preload=true`;
}
function bunnyThumb(videoId) {
  return `https://${BUNNY_CDN}/${videoId}/thumbnail.jpg`;
}

function formatDate(ts) {
  return new Date(ts).toLocaleDateString("en-US", { month:"short", day:"numeric", year:"numeric" });
}
function formatCount(n) {
  if (n >= 1000000) return (n/1000000).toFixed(1).replace('.0','') + 'M';
  if (n >= 1000) return (n/1000).toFixed(1).replace('.0','') + 'K';
  return n.toString();
}

// Device token for anonymous view tracking
function getDeviceToken() {
  let t = localStorage.getItem('device_token');
  if (!t) {
    t = Array.from(crypto.getRandomValues(new Uint8Array(24))).map(b=>b.toString(16).padStart(2,'0')).join('');
    localStorage.setItem('device_token', t);
  }
  return t;
}

async function api(path, options = {}) {
  const res = await fetch(path, { ...options, credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(options.headers||{}) } });
  if (!res.ok) { const msg = await res.text(); throw new Error(msg || 'Request failed'); }
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

// ── Avatar ─────────────────────────────────────────────
function Avatar({ url, name, size = 32 }) {
  const initials = (name||'?').split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
  if (url) return <img src={url} alt={name} style={{width:size,height:size,borderRadius:'50%',objectFit:'cover',flexShrink:0}} />;
  return <div style={{width:size,height:size,borderRadius:'50%',background:'#e5231b',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:size*0.38,fontWeight:700,flexShrink:0}}>{initials}</div>;
}

// ── Auth Panel ─────────────────────────────────────────
function AuthPanel({ onAuthed }) {
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

// ── Avatar Picker ──────────────────────────────────────
const PRESET_AVATARS = Array.from({ length: 10 }, (_, i) => `/avatar-presets/avatar-${String(i + 1).padStart(2, '0')}.svg`);

function AvatarPicker({ user, onUpdated }) {
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
          {error && <span style={{color:'#e5231b',fontSize:11,marginLeft:6}}>{error}</span>}
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

// ── Report Modal ───────────────────────────────────────
function ReportModal({ onSubmit, onCancel }) {
  const [reason, setReason] = useState('inappropriate');
  return (
    <div className="report-modal">
      <p style={{fontWeight:600,marginBottom:10}}>Report comment</p>
      <select value={reason} onChange={e=>setReason(e.target.value)} style={{width:'100%',marginBottom:10,padding:'6px 8px',background:'#1a1a1a',border:'1px solid #333',color:'#f5f5f5',borderRadius:4}}>
        <option value="inappropriate">Inappropriate</option>
        <option value="spam">Spam</option>
        <option value="harassment">Harassment</option>
        <option value="misinformation">Misinformation</option>
      </select>
      <div style={{display:'flex',gap:8}}>
        <button className="btn-primary" onClick={()=>onSubmit(reason)} type="button">Submit</button>
        <button className="btn-ghost" onClick={onCancel} type="button">Cancel</button>
      </div>
    </div>
  );
}

// ── Single Comment ─────────────────────────────────────
function Comment({ c, user, onReply, onVote, onReport, onDelete, onUnhide, depth=0 }) {
  const [reporting, setReporting] = useState(false);

  async function handleReport(reason) {
    setReporting(false);
    try { await onReport(c.id, reason); } catch {}
  }

  const isOwn = user && user.id === c.user_id;
  const hidden = c.is_hidden === 1 && !user?.is_admin;
  if (hidden) return null;

  return (
    <li className="comment" style={{marginLeft:depth>0?32:0, borderLeft:depth>0?'2px solid #2a2a2a':'2px solid #e5231b', opacity:c.is_hidden===1?0.5:1}}>
      {c.is_hidden===1 && user?.is_admin && (
        <div style={{fontSize:11,color:'#e5231b',marginBottom:4}}>⚠ Hidden ({c.report_count} reports)
          <button className="link-btn" style={{marginLeft:8}} onClick={()=>onUnhide(c.id)}>Restore</button>
        </div>
      )}
      <div style={{display:'flex',gap:8,alignItems:'flex-start'}}>
        <Avatar url={c.avatar_url} name={c.author} size={28} />
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:'flex',alignItems:'center',gap:8,flexWrap:'wrap',marginBottom:4}}>
            <span style={{fontWeight:600,fontSize:12,color:'#f5f5f5'}}>{c.author}</span>
            <span style={{fontSize:11,color:'#555'}}>{formatDate(c.created_at)}</span>
          </div>
          <p style={{margin:0,fontSize:13,color:'#d0d0d0',wordBreak:'break-word',lineHeight:1.5}}>{c.text}</p>
          <div style={{display:'flex',gap:14,marginTop:8,alignItems:'center',flexWrap:'wrap'}}>
            {user && (
              <>
                <button className={`vote-btn ${c.my_vote===1?'active-like':''}`} onClick={()=>onVote(c.id,1)} type="button">
                  👍 {c.like_count > 0 ? formatCount(c.like_count) : ''}
                </button>
                <button className={`vote-btn ${c.my_vote===-1?'active-dislike':''}`} onClick={()=>onVote(c.id,-1)} type="button">
                  👎 {c.dislike_count > 0 ? formatCount(c.dislike_count) : ''}
                </button>
              </>
            )}
            {!user && (
              <>
                <span style={{fontSize:12,color:'#555'}}>👍 {formatCount(c.like_count)}</span>
                <span style={{fontSize:12,color:'#555'}}>👎 {formatCount(c.dislike_count)}</span>
              </>
            )}
            {user && depth===0 && <button className="link-btn" onClick={()=>onReply(c)} type="button">Reply</button>}
            {user && !c.my_report && <button className="link-btn" style={{color:'#555'}} onClick={()=>setReporting(true)} type="button">Report</button>}
            {(isOwn || user?.is_admin) && <button className="link-btn" style={{color:'#555'}} onClick={()=>onDelete(c.id)} type="button">Delete</button>}
            {user?.is_admin && <button className="link-btn" style={{color:'#f59e0b'}} onClick={()=>onReport(c.user_id, 'ban')} type="button">Ban user</button>}
          </div>
          {reporting && <ReportModal onSubmit={handleReport} onCancel={()=>setReporting(false)} />}
        </div>
      </div>
    </li>
  );
}

// ── Comments Section ───────────────────────────────────
function Comments({ videoId, user, onAuthed, onSignOut, onUpdateUser }) {
  const [comments, setComments] = useState(null);
  const [error, setError]       = useState(null);
  const [text, setText]         = useState('');
  const [posting, setPosting]   = useState(false);
  const [replyTo, setReplyTo]   = useState(null);
  const [sort, setSort]         = useState('newest'); // newest | oldest | top
  const textareaRef             = useRef(null);

  const load = useCallback(async () => {
    try { setComments(await api(`/api/videos/${videoId}/comments`)); }
    catch { setError("Couldn't load comments."); }
  }, [videoId]);

  useEffect(() => { setComments(null); setError(null); load(); }, [load]);

  async function submit(e) {
    e.preventDefault(); if (!text.trim()) return;
    setPosting(true); setError(null);
    try {
      const saved = await api(`/api/videos/${videoId}/comments`, {
        method:'POST', body: JSON.stringify({ text: text.trim(), parent_id: replyTo?.id || null })
      });
      setComments(prev=>[...(prev||[]), saved]);
      setText(''); setReplyTo(null);
    } catch(e) { setError(e.message); }
    finally { setPosting(false); }
  }

  async function handleVote(commentId, vote) {
    if (!user) return;
    try {
      const res = await api(`/api/comments/${commentId}/vote`, { method:'POST', body: JSON.stringify({vote}) });
      setComments(prev => prev.map(c => {
        if (c.id !== commentId) return c;
        const old = c.my_vote;
        let likes = c.like_count, dislikes = c.dislike_count;
        if (res.vote === null) { if (old===1) likes--; else dislikes--; }
        else if (old === null) { if (vote===1) likes++; else dislikes++; }
        else { if (vote===1) { likes++; dislikes--; } else { dislikes++; likes--; } }
        return { ...c, like_count: Math.max(0,likes), dislike_count: Math.max(0,dislikes), my_vote: res.vote };
      }));
    } catch {}
  }

  async function handleReport(commentId, reason) {
    if (reason === 'ban') {
      const c = comments.find(x=>x.id===commentId);
      if (!c || !confirm(`Ban user ${c.author}?`)) return;
      try { await api('/api/admin/ban', { method:'POST', body: JSON.stringify({user_id: c.user_id, banned: true}) }); alert('User banned.'); }
      catch(e) { alert(e.message); }
      return;
    }
    try {
      await api(`/api/comments/${commentId}/report`, { method:'POST', body: JSON.stringify({reason}) });
      setComments(prev => prev.map(c => c.id===commentId ? {...c, my_report:1, report_count: c.report_count+1, is_hidden: c.report_count+1>=3?1:0} : c));
    } catch(e) { alert(e.message); }
  }

  async function handleDelete(commentId) {
    if (!confirm('Delete this comment?')) return;
    try {
      await api(`/api/comments/${commentId}/delete`, { method:'POST' });
      setComments(prev=>prev.filter(c=>c.id!==commentId));
    } catch(e) { alert(e.message); }
  }

  async function handleUnhide(commentId) {
    try {
      await api('/api/admin/unhide', { method:'POST', body: JSON.stringify({comment_id:commentId}) });
      setComments(prev=>prev.map(c=>c.id===commentId?{...c,is_hidden:0,report_count:0}:c));
    } catch(e) { alert(e.message); }
  }

  const topLevel = (comments||[]).filter(c=>!c.parent_id);
  const replies  = (comments||[]).filter(c=> c.parent_id);

  const sortedTopLevel = [...topLevel].sort((a,b) => {
    if (sort === 'oldest') return a.created_at - b.created_at;
    if (sort === 'top')    return (b.like_count - b.dislike_count) - (a.like_count - a.dislike_count);
    return b.created_at - a.created_at; // newest
  });

  return (
    <div className="comments">
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12,flexWrap:'wrap',gap:8}}>
        <h3 className="comments-heading" style={{margin:0}}>
          Comments {comments ? `(${comments.length})` : ''}
        </h3>
        {comments && comments.length > 1 && (
          <div className="sort-bar">
            <span style={{fontSize:11,color:'#555',marginRight:6}}>Sort:</span>
            {['newest','oldest','top'].map(s => (
              <button key={s} className={`sort-btn ${sort===s?'active':''}`}
                onClick={()=>setSort(s)} type="button">
                {s === 'newest' ? '🕐 Newest' : s === 'oldest' ? '📅 Oldest' : '🔥 Top'}
              </button>
            ))}
          </div>
        )}
      </div>
      {comments===null && !error && <p className="muted">Loading…</p>}
      {error && <p style={{color:'#e5231b',fontSize:13}}>{error}</p>}
      {comments?.length===0 && <p className="muted">No comments yet. Be the first.</p>}

      <ul className="comments-list">
        {sortedTopLevel.map(c=>(
          <div key={c.id}>
            <Comment c={c} user={user} onReply={c=>{setReplyTo(c);setTimeout(()=>textareaRef.current?.focus(),50);}}
              onVote={handleVote} onReport={handleReport} onDelete={handleDelete} onUnhide={handleUnhide} depth={0} />
            {replies.filter(r=>r.parent_id===c.id).map(r=>(
              <Comment key={r.id} c={r} user={user} onReply={()=>{}} onVote={handleVote}
                onReport={handleReport} onDelete={handleDelete} onUnhide={handleUnhide} depth={1} />
            ))}
          </div>
        ))}
      </ul>

      {user ? (
        <>
          <AvatarPicker user={user} onUpdated={onUpdateUser} />
          {replyTo && (
            <div style={{fontSize:12,color:'#8a8a8a',marginBottom:6,display:'flex',gap:8,alignItems:'center'}}>
              Replying to <strong style={{color:'#f5f5f5'}}>{replyTo.author}</strong>
              <button className="link-btn" onClick={()=>setReplyTo(null)} type="button">cancel</button>
            </div>
          )}
          <form className="comment-form" onSubmit={submit}>
            <textarea ref={textareaRef} placeholder={replyTo?`Reply to ${replyTo.author}…`:'Say something…'}
              value={text} onChange={e=>setText(e.target.value)} maxLength={500} rows={2} required />
            <button type="submit" disabled={posting}>{posting?'Posting…':replyTo?'Post reply':'Post comment'}</button>
            {error && <p className="form-error">{error}</p>}
          </form>
          <p className="muted" style={{marginTop:8}}>
            Signed in as <strong style={{color:'#f5f5f5'}}>{user.name}</strong> ·{' '}
            <button className="link-btn" onClick={onSignOut} type="button">sign out</button>
          </p>
        </>
      ) : (
        <AuthPanel onAuthed={onAuthed} />
      )}
    </div>
  );
}

// ── Video Modal ────────────────────────────────────────
function VideoModal({ video: initialVideo, onClose, user, onAuthed, onSignOut, onUpdateUser }) {
  const overlayRef             = useRef(null);
  const viewSent               = useRef(false);
  const [video, setVideo]      = useState(initialVideo);
  const [copied, setCopied]    = useState(false);

  useEffect(() => { setVideo(initialVideo); }, [initialVideo]);

  async function handleVideoVote(vote) {
    if (!user) return;
    try {
      const res = await api(`/api/videos/${video.id}/vote`, { method:'POST', body: JSON.stringify({vote}) });
      setVideo(prev => {
        const old = prev.my_vote;
        let likes = prev.like_count, dislikes = prev.dislike_count;
        if (res.vote === null) { if (old===1) likes--; else dislikes--; }
        else if (old === null) { if (vote===1) likes++; else dislikes++; }
        else { if (vote===1) { likes++; dislikes--; } else { dislikes++; likes--; } }
        return { ...prev, like_count: Math.max(0,likes), dislike_count: Math.max(0,dislikes), my_vote: res.vote };
      });
    } catch {}
  }

  function handleShare() {
    const url = `${window.location.origin}?v=${video.id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      // fallback for older browsers
      const el = document.createElement('textarea');
      el.value = url; document.body.appendChild(el);
      el.select(); document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  useEffect(() => {
    const onKey = e => { if (e.key==='Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Count view after 5 seconds
  useEffect(() => {
    if (viewSent.current) return;
    const timer = setTimeout(async () => {
      viewSent.current = true;
      try {
        const body = user ? {} : { device_token: getDeviceToken() };
        await api(`/api/videos/${video.id}/view`, { method:'POST', body: JSON.stringify(body) });
      } catch {}
    }, 5000);
    return () => clearTimeout(timer);
  }, [video.id, user]);

  return (
    <div className="overlay" ref={overlayRef} onMouseDown={e=>{if(e.target===overlayRef.current)onClose();}}>
      <div className="modal">
        <button className="modal-close" onClick={onClose}>×</button>

        <div className="video-container">
          <iframe src={bunnyEmbed(video.bunny_video_id)} allowFullScreen allow="autoplay"
            style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',border:'none'}} />
        </div>

        <div className="modal-meta">
          <div>
            <h2 className="modal-title">{video.title}</h2>
            {video.description && !video.description.startsWith('Recorded') && <p className="modal-desc">{video.description}</p>}
            <div className="modal-stats">
              <span>👁 {formatCount(video.view_count)} views</span>
              <span>💬 {formatCount(video.comment_count)} comments</span>
              <span>📅 {formatDate(video.created_at)}</span>
            </div>
          </div>
          <div className="video-actions">
            <div className="video-vote-group">
              <button
                className={`video-vote-btn like ${video.my_vote===1?'active':''}`}
                onClick={()=>handleVideoVote(1)} type="button"
                title={user?'Like':'Sign in to like'}>
                👍 {video.like_count > 0 ? formatCount(video.like_count) : 'Like'}
              </button>
              <div className="vote-divider" />
              <button
                className={`video-vote-btn dislike ${video.my_vote===-1?'active':''}`}
                onClick={()=>handleVideoVote(-1)} type="button"
                title={user?'Dislike':'Sign in to dislike'}>
                👎 {video.dislike_count > 0 ? formatCount(video.dislike_count) : ''}
              </button>
            </div>
            <button className="video-share-btn" onClick={handleShare} type="button">
              {copied ? '✓ Copied!' : '↗ Share'}
            </button>
          </div>
        </div>

        <Comments videoId={video.id} user={user} onAuthed={onAuthed} onSignOut={onSignOut} onUpdateUser={onUpdateUser} />
      </div>
    </div>
  );
}

// ── Admin: Add Video Panel ─────────────────────────────
function AddVideoPanel({ onAdded }) {
  const [title, setTitle] = useState('');
  const [desc, setDesc]   = useState('');
  const [vid, setVid]     = useState('');
  const [busy, setBusy]   = useState(false);
  const [error, setError] = useState(null);

  async function submit(e) {
    e.preventDefault(); setBusy(true); setError(null);
    try {
      const video = await api('/api/videos', { method:'POST', body: JSON.stringify({
        title, description: desc, bunny_video_id: vid.trim(),
        thumbnail_url: bunnyThumb(vid.trim())
      })});
      onAdded(video);
      setTitle(''); setDesc(''); setVid('');
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
        <button type="submit" disabled={busy} className="btn-primary">{busy?'Adding…':'Add video'}</button>
        {error && <p className="form-error">{error}</p>}
      </form>
    </div>
  );
}

// ── Main Gallery ───────────────────────────────────────
export default function ClownDanceGallery() {
  const [videos, setVideos]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [selected, setSelected] = useState(null);
  const [user, setUser]         = useState(null);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    api('/api/auth/me').then(setUser).catch(()=>setUser(null));
    api('/api/videos').then(v => {
      setVideos(v);
      setLoading(false);
      // Deep link: open video if ?v=ID is in URL
      const params = new URLSearchParams(window.location.search);
      const videoId = params.get('v');
      if (videoId) {
        const match = v.find(vid => vid.id === parseInt(videoId));
        if (match) setSelected(match);
      }
    }).catch(()=>setLoading(false));
  }, []);

  function openVideo(video) {
    setSelected(video);
    window.history.pushState({}, '', `?v=${video.id}`);
  }

  function closeVideo() {
    setSelected(null);
    window.history.pushState({}, '', window.location.pathname);
  }

  // Handle browser back/forward buttons
  useEffect(() => {
    function onPop() {
      const params = new URLSearchParams(window.location.search);
      const videoId = params.get('v');
      if (videoId) {
        const match = videos.find(v => v.id === parseInt(videoId));
        if (match) { setSelected(match); return; }
      }
      setSelected(null);
    }
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [videos]);

  async function handleSignOut() {
    try { await fetch('/api/auth/logout', { method:'POST', credentials:'include' }); }
    finally { setUser(null); }
  }

  return (
    <div className="page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,700;9..144,900&family=Inter:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0a0a; }
        .page { background: #0a0a0a; color: #f5f5f5; font-family: 'Inter', sans-serif; min-height: 100vh; padding: 48px 32px 80px; }
        .top-bar { max-width: 1180px; margin: 0 auto 32px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
        .site-title { font-family: 'Fraunces', serif; font-size: clamp(20px,3vw,28px); font-weight: 900; }
        .site-title span { color: #e5231b; }
        .top-bar-right { display: flex; align-items: center; gap: 12px; font-size: 13px; color: #8a8a8a; }
        .header { max-width: 1180px; margin: 0 auto 40px; }
        .header h1 { font-family: 'Fraunces', serif; font-weight: 700; font-size: clamp(26px,4vw,42px); line-height: 1.15; margin-bottom: 8px; }
        .header p { color: #8a8a8a; font-size: 15px; }
        .grid { max-width: 1180px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px; }
        .card { background: #141414; border: 1px solid #1e1e1e; border-radius: 6px; overflow: hidden; cursor: pointer; text-align: left; padding: 0; color: inherit; font: inherit; transition: transform 0.18s, border-color 0.18s; }
        .card:hover { transform: translateY(-2px); border-color: #e5231b; }
        .card-thumb-wrap { position: relative; aspect-ratio: 16/9; background: #111; overflow: hidden; }
        .card-thumb { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.25s; }
        .card:hover .card-thumb { transform: scale(1.04); }
        .card-thumb-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: #1a1a1a; color: #333; font-size: 32px; }
        .card-stats-bar { position: absolute; bottom: 0; left: 0; right: 0; padding: 6px 10px; background: linear-gradient(transparent, rgba(0,0,0,0.85)); display: flex; gap: 10px; font-size: 11px; color: rgba(255,255,255,0.7); }
        .card-body { padding: 10px 12px 14px; }
        .card-body h3 { font-size: 14px; font-weight: 600; margin-bottom: 4px; color: #f5f5f5; line-height: 1.3; }
        .card-body span { font-size: 11px; color: #555; }
        .overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.94); display: flex; align-items: flex-start; justify-content: center; overflow-y: auto; padding: 32px 16px 60px; z-index: 50; }
        .modal { background: #111; border: 1px solid #1e1e1e; border-radius: 8px; max-width: 760px; width: 100%; position: relative; }
        .modal-close { position: absolute; top: 12px; right: 12px; background: rgba(0,0,0,0.6); border: 1px solid #333; color: #f5f5f5; width: 32px; height: 32px; border-radius: 50%; font-size: 20px; cursor: pointer; display: flex; align-items: center; justify-content: center; z-index: 2; }
        .video-container { position: relative; aspect-ratio: 16/9; background: #000; border-radius: 8px 8px 0 0; overflow: hidden; }
        .modal-meta { padding: 16px 20px 12px; border-bottom: 1px solid #1e1e1e; display: flex; flex-direction: column; gap: 12px; }
        .modal-title { font-family: 'Fraunces', serif; font-size: 20px; font-weight: 700; margin-bottom: 6px; }
        .modal-desc { font-size: 13px; color: #8a8a8a; margin-bottom: 8px; line-height: 1.5; }
        .modal-stats { display: flex; gap: 16px; font-size: 12px; color: #555; flex-wrap: wrap; }
        .video-actions { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .video-vote-group { display: flex; align-items: stretch; border: 1px solid #2a2a2a; border-radius: 20px; overflow: hidden; }
        .video-vote-btn { background: transparent; border: none; color: #8a8a8a; font-size: 13px; padding: 7px 14px; cursor: pointer; font-family: inherit; display: flex; align-items: center; gap: 5px; transition: background 0.15s, color 0.15s; }
        .video-vote-btn:hover { background: #1e1e1e; color: #f5f5f5; }
        .video-vote-btn.like.active { color: #22c55e; }
        .video-vote-btn.dislike.active { color: #e5231b; }
        .vote-divider { width: 1px; background: #2a2a2a; flex-shrink: 0; }
        .video-share-btn { background: #1e1e1e; border: 1px solid #2a2a2a; color: #f5f5f5; font-size: 13px; padding: 7px 16px; border-radius: 20px; cursor: pointer; font-family: inherit; transition: background 0.15s; }
        .video-share-btn:hover { background: #2a2a2a; }
        .sort-bar { display: flex; align-items: center; gap: 4px; flex-wrap: wrap; }
        .sort-btn { background: transparent; border: 1px solid #2a2a2a; color: #555; font-size: 11px; padding: 4px 10px; border-radius: 12px; cursor: pointer; font-family: inherit; transition: all 0.15s; white-space: nowrap; }
        .sort-btn:hover { border-color: #555; color: #f5f5f5; }
        .sort-btn.active { border-color: #e5231b; color: #f5f5f5; background: rgba(229,35,27,0.1); }
        .comments { padding: 16px 20px 24px; }
        .comments-heading { font-size: 15px; font-weight: 600; margin-bottom: 12px; color: #f5f5f5; text-align: left; }
        .comments-list { list-style: none; display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; max-height: 360px; overflow-y: auto; padding-right: 4px; }
        .comments-list::-webkit-scrollbar { width: 4px; }
        .comments-list::-webkit-scrollbar-thumb { background: #2a2a2a; border-radius: 2px; }
        .comment { background: #161616; border-radius: 4px; padding: 10px 12px; }
        .auth-panel { background: #141414; border: 1px solid #1e1e1e; border-radius: 6px; padding: 14px; }
        .auth-note { font-size: 13px; color: #8a8a8a; margin-bottom: 10px; }
        .auth-tabs { display: flex; gap: 6px; margin-bottom: 10px; }
        .auth-tabs button { background: none; border: 1px solid #2a2a2a; color: #8a8a8a; font-size: 12px; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-family: inherit; transition: all 0.15s; }
        .auth-tabs button.active { border-color: #e5231b; color: #f5f5f5; }
        .auth-form, .comment-form { display: flex; flex-direction: column; gap: 8px; }
        .auth-form input, .comment-form textarea { background: #1a1a1a; border: 1px solid #2a2a2a; border-radius: 4px; color: #f5f5f5; padding: 8px 10px; font-family: inherit; font-size: 13px; outline: none; transition: border-color 0.15s; }
        .auth-form input:focus, .comment-form textarea:focus { border-color: #e5231b; }
        .comment-form textarea { resize: vertical; }
        .auth-form button[type=submit], .comment-form button[type=submit], .btn-primary { background: #e5231b; color: #fff; border: none; border-radius: 4px; padding: 8px 16px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; transition: background 0.15s; align-self: flex-start; }
        .auth-form button:hover, .comment-form button:hover, .btn-primary:hover { background: #c41d17; }
        .auth-form button:disabled, .comment-form button:disabled { opacity: 0.6; cursor: default; }
        .btn-ghost { background: transparent; border: 1px solid #333; color: #8a8a8a; border-radius: 4px; padding: 6px 12px; font-size: 12px; cursor: pointer; font-family: inherit; }
        .link-btn { background: none; border: none; color: #e5231b; font-size: 12px; cursor: pointer; padding: 0; font-family: inherit; }
        .link-btn:hover { text-decoration: underline; }
        .avatar-grid { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; padding: 10px; background: #141414; border: 1px solid #1e1e1e; border-radius: 6px; }
        .avatar-choice { background: none; border: 2px solid transparent; border-radius: 50%; padding: 2px; line-height: 0; cursor: pointer; transition: border-color 0.15s; }
        .avatar-choice:hover { border-color: #555; }
        .avatar-choice.selected { border-color: #e5231b; }
        .avatar-choice:disabled { opacity: 0.6; cursor: default; }
        .vote-btn { background: none; border: 1px solid #2a2a2a; color: #8a8a8a; font-size: 12px; padding: 3px 8px; border-radius: 3px; cursor: pointer; font-family: inherit; transition: all 0.15s; }
        .vote-btn:hover { border-color: #555; color: #f5f5f5; }
        .vote-btn.active-like { border-color: #22c55e; color: #22c55e; background: rgba(34,197,94,0.08); }
        .vote-btn.active-dislike { border-color: #e5231b; color: #e5231b; background: rgba(229,35,27,0.08); }
        .form-error { color: #e5231b; font-size: 12px; }
        .muted { font-size: 12px; color: #555; }
        .report-modal { background: #1a1a1a; border: 1px solid #2a2a2a; border-radius: 6px; padding: 12px; margin-top: 8px; }
        .add-video-panel { max-width: 1180px; margin: 32px auto 0; background: #141414; border: 1px solid #1e1e1e; border-radius: 6px; padding: 20px; }
        .add-video-panel input { background: #1a1a1a; border: 1px solid #2a2a2a; border-radius: 4px; color: #f5f5f5; padding: 8px 10px; font-family: inherit; font-size: 13px; width: 100%; }
        .empty-state { max-width: 1180px; margin: 60px auto; text-align: center; color: #555; }

        /* ── MOBILE RESPONSIVE ── */
        @media (max-width: 600px) {
          .page { padding: 20px 16px 60px; }
          .top-bar { margin-bottom: 20px; }
          .site-title { font-size: 18px; }
          .top-bar-right { font-size: 12px; }
          .header { margin-bottom: 24px; }
          .header h1 { font-size: 22px; line-height: 1.2; }
          .header p { font-size: 13px; }
          .grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
          .card-body h3 { font-size: 12px; }
          .overlay { padding: 0; align-items: flex-end; }
          .modal { border-radius: 16px 16px 0 0; max-height: 96vh; overflow-y: auto; }
          .modal-close { top: 10px; right: 10px; }
          .modal-meta { padding: 12px 16px 10px; gap: 10px; }
          .modal-title { font-size: 16px; }
          .modal-stats { gap: 10px; font-size: 11px; }
          .video-actions { gap: 8px; }
          .video-vote-btn { font-size: 12px; padding: 6px 10px; }
          .video-share-btn { font-size: 12px; padding: 6px 12px; }
          .comments { padding: 12px 16px 80px; }
          .comments-list { max-height: 240px; }
          .comment { padding: 8px 10px; }
          .auth-panel { padding: 12px; }
          .vote-btn { padding: 2px 6px; font-size: 11px; }
          .add-video-panel { margin: 20px 0 0; padding: 16px; }
        }
        @media (max-width: 380px) {
          .grid { grid-template-columns: 1fr; }
        }
        .empty-state p { font-size: 15px; margin-top: 8px; }
      `}</style>

      <div className="top-bar">
        <div className="site-title">Clown <span>Dance</span> Gallery</div>
        <div className="top-bar-right">
          {user ? (
            <>
              <Avatar url={user.avatar_url} name={user.name} size={26} />
              <span style={{color:'#f5f5f5'}}>{user.name}</span>
              <button className="link-btn" onClick={handleSignOut}>sign out</button>
            </>
          ) : (
            <span style={{color:'#555',cursor:'pointer'}} onClick={()=>setShowAuth(true)}>Sign in to comment</span>
          )}
        </div>
      </div>

      <header className="header">
        <h1>This is me, dressed as a clown while dancing.<br/>Come and join the conversation</h1>
        <p>May – July 2026</p>
      </header>

      {loading && <div className="empty-state"><p>Loading videos…</p></div>}

      {!loading && videos.length === 0 && (
        <div className="empty-state">
          <p>No videos yet.{user?.is_admin ? ' Add one below.' : ''}</p>
        </div>
      )}

      <div className="grid">
        {videos.map(v => (
          <button key={v.id} className="card" onClick={()=>openVideo(v)}>
            <div className="card-thumb-wrap">
              {v.thumbnail_url
                ? <img className="card-thumb" src={v.thumbnail_url} alt={v.title} loading="lazy" />
                : <div className="card-thumb-placeholder">▶</div>
              }
              <div className="card-stats-bar">
                <span>👁 {formatCount(v.view_count)}</span>
                <span>💬 {formatCount(v.comment_count)}</span>
              </div>
            </div>
            <div className="card-body">
              <h3>{v.title}</h3>
              <span>{formatDate(v.created_at)}</span>
            </div>
          </button>
        ))}
      </div>

      {user?.is_admin && (
        <AddVideoPanel onAdded={v => setVideos(prev=>[v,...prev])} />
      )}

      {showAuth && !user && (
        <div className="overlay" onMouseDown={e=>{if(e.target===e.currentTarget)setShowAuth(false);}}>
          <div className="modal" style={{maxWidth:420,marginTop:80,padding:24}}>
            <button className="modal-close" onClick={()=>setShowAuth(false)}>×</button>
            <p style={{fontFamily:"'Fraunces',serif",fontSize:20,fontWeight:700,marginBottom:16}}>Join the conversation</p>
            <AuthPanel onAuthed={u=>{setUser(u);setShowAuth(false);}} />
          </div>
        </div>
      )}

      {selected && (
        <VideoModal
          video={selected}
          onClose={closeVideo}
          user={user}
          onAuthed={setUser}
          onSignOut={handleSignOut}
          onUpdateUser={setUser}
        />
      )}
    </div>
  );
}
