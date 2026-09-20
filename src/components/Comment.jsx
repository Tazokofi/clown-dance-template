import { useState } from "react";
import { formatDate, formatCount } from "../utils.js";
import Avatar from "./Avatar.jsx";
import ReportModal from "./ReportModal.jsx";

// ── Single Comment ─────────────────────────────────────
export default function Comment({ c, user, onReply, onVote, onReport, onDelete, onUnhide, depth=0 }) {
  const [reporting, setReporting] = useState(false);

  async function handleReport(reason) {
    setReporting(false);
    try { await onReport(c.id, reason); } catch {}
  }

  const isOwn = user && user.id === c.user_id;
  const hidden = c.is_hidden === 1 && !user?.is_admin;
  if (hidden) return null;

  return (
    <li className="comment" style={{marginLeft:depth>0?32:0, borderLeft:depth>0?'2px solid #2a2a2a':'2px solid var(--accent)', opacity:c.is_hidden===1?0.5:1}}>
      {c.is_hidden===1 && user?.is_admin && (
        <div style={{fontSize:11,color:'var(--accent)',marginBottom:4}}>⚠ Hidden ({c.report_count} reports)
          <button className="link-btn" style={{marginLeft:8}} onClick={()=>onUnhide(c.id)}>Restore</button>
        </div>
      )}
      <div style={{display:'flex',gap:8,alignItems:'flex-start'}}>
        <Avatar url={c.avatar_url} name={c.author} size={28} />
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:'flex',alignItems:'center',gap:8,flexWrap:'wrap',marginBottom:4}}>
            <span style={{fontWeight:600,fontSize:12,color:'#f5f5f5'}}>{c.author}</span>
            {c.is_admin ? <span className="admin-badge">ADMIN</span> : null}
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
