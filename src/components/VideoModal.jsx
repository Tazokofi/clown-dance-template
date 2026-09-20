import { useState, useEffect, useRef } from "react";
import { SITE } from "../config.js";
import { api, bunnyEmbed, formatCount, formatDate, getDeviceToken } from "../utils.js";
import TipJarIcon from "./TipJarIcon.jsx";
import Comments from "./Comments.jsx";
import EditVideoForm from "./EditVideoForm.jsx";

// ── Video Modal ────────────────────────────────────────
export default function VideoModal({ video: initialVideo, videos, onNavigate, onVideoUpdated, onClose, user, onAuthed, onSignOut, onUpdateUser }) {
  const overlayRef             = useRef(null);
  const viewSentForId          = useRef(null);
  const [video, setVideo]      = useState(initialVideo);
  const [copied, setCopied]    = useState(false);

  useEffect(() => { setVideo(initialVideo); setCopied(false); }, [initialVideo]);

  const currentIndex = (videos || []).findIndex(v => v.id === video.id);
  const prevVideo = currentIndex > 0 ? videos[currentIndex - 1] : null;
  const nextVideo = currentIndex >= 0 && currentIndex < (videos ? videos.length - 1 : -1) ? videos[currentIndex + 1] : null;
  function goNext() { if (nextVideo) onNavigate(nextVideo); }
  function goPrev() { if (prevVideo) onNavigate(prevVideo); }

  const [editing, setEditing] = useState(false);
  function handleVideoSaved(updated) {
    setVideo(prev => ({ ...prev, ...updated }));
    if (onVideoUpdated) onVideoUpdated({ ...video, ...updated });
    setEditing(false);
  }

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
    const url = `${window.location.origin}/video/${video.id}`;
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

  // Count view after 5 seconds (resets when the modal switches to a new video)
  useEffect(() => {
    if (viewSentForId.current === video.id) return;
    const timer = setTimeout(async () => {
      viewSentForId.current = video.id;
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
          <iframe key={video.bunny_video_id} src={bunnyEmbed(video.bunny_video_id)} allowFullScreen allow="autoplay" loading="lazy"
            style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',border:'none'}} />
        </div>

        <div className="modal-meta">
          <div>
            <h2 className="modal-title">{video.title}</h2>
            {video.description && !video.description.startsWith('Recorded') && <p className="modal-desc">{video.description}</p>}
            <div className="modal-stats">
              <span>👁 {formatCount(video.view_count)} view{video.view_count===1?'':'s'}</span>
              <span>💬 {formatCount(video.comment_count)} comment{video.comment_count===1?'':'s'}</span>
              <span>📅 {formatDate(video.created_at)}</span>
            </div>
            {user?.is_admin && (
              editing
                ? <EditVideoForm video={video} onSaved={handleVideoSaved} onCancel={()=>setEditing(false)} />
                : <button className="link-btn" onClick={()=>setEditing(true)} type="button" style={{marginTop:6}}>✎ Edit video</button>
            )}
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
                👎 {video.dislike_count > 0 ? formatCount(video.dislike_count) : 'Dislike'}
              </button>
            </div>
            <a className="tip-btn" href={SITE.tipUrl} target="_blank" rel="noopener noreferrer">
              <TipJarIcon /> Tip Jar
            </a>
            <button className="video-share-btn" onClick={handleShare} type="button">
              {copied ? '✓ Copied!' : '↗ Share'}
            </button>
            {prevVideo && <button className="video-share-btn" onClick={goPrev} type="button">⏮ Prev</button>}
            {nextVideo && <button className="video-share-btn" onClick={goNext} type="button">Next ⏭</button>}
          </div>
        </div>

        <Comments videoId={video.id} user={user} onAuthed={onAuthed} onSignOut={onSignOut} onUpdateUser={onUpdateUser} />
      </div>
    </div>
  );
}
