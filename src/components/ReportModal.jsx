import { useState } from "react";

// ── Report Modal ───────────────────────────────────────
export default function ReportModal({ onSubmit, onCancel }) {
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
