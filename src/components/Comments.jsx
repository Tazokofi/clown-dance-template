import { useState, useEffect, useRef, useCallback } from "react";
import { api } from "../utils.js";
import AvatarPicker from "./AvatarPicker.jsx";
import AuthPanel from "./AuthPanel.jsx";
import Comment from "./Comment.jsx";

// ── Comments Section ───────────────────────────────────
export default function Comments({ kind = 'video', videoId, user, onAuthed, onSignOut, onUpdateUser }) {
  const [comments, setComments] = useState(null);
  const [error, setError]       = useState(null);
  const [text, setText]         = useState('');
  const [posting, setPosting]   = useState(false);
  const [replyTo, setReplyTo]   = useState(null);
  const [sort, setSort]         = useState('newest'); // newest | oldest | top
  const textareaRef             = useRef(null);

  const listUrl = kind === 'site' ? '/api/site-comments' : `/api/videos/${videoId}/comments`;
  const actionBase = kind === 'site' ? '/api/site-comments' : '/api/comments';

  const load = useCallback(async () => {
    try { setComments(await api(listUrl)); }
    catch { setError("Couldn't load comments."); }
  }, [listUrl]);

  useEffect(() => { setComments(null); setError(null); load(); }, [load]);

  async function submit(e) {
    e.preventDefault(); if (!text.trim()) return;
    setPosting(true); setError(null);
    try {
      const saved = await api(listUrl, {
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
      const res = await api(`${actionBase}/${commentId}/vote`, { method:'POST', body: JSON.stringify({vote}) });
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
      await api(`${actionBase}/${commentId}/report`, { method:'POST', body: JSON.stringify({reason}) });
      setComments(prev => prev.map(c => c.id===commentId ? {...c, my_report:1, report_count: c.report_count+1, is_hidden: c.report_count+1>=3?1:0} : c));
    } catch(e) { alert(e.message); }
  }

  async function handleDelete(commentId) {
    if (!confirm('Delete this comment?')) return;
    try {
      await api(`${actionBase}/${commentId}/delete`, { method:'POST' });
      setComments(prev=>prev.filter(c=>c.id!==commentId));
    } catch(e) { alert(e.message); }
  }

  async function handleUnhide(commentId) {
    try {
      await api('/api/admin/unhide', { method:'POST', body: JSON.stringify({comment_id:commentId, kind}) });
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
      {error && <p style={{color:'var(--accent)',fontSize:13}}>{error}</p>}
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
