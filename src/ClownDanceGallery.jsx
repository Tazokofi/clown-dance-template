import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SITE, INITIAL_VIDEOS_SHOWN } from "./config.js";
import { api, hexToRgb, formatDate, formatCount, formatDuration } from "./utils.js";
import { useVideos } from "./hooks/useVideos.js";
import Avatar from "./components/Avatar.jsx";
import AuthPanel from "./components/AuthPanel.jsx";
import AddVideoPanel from "./components/AddVideoPanel.jsx";
import FAQSection from "./components/FAQSection.jsx";
import TipJarIcon from "./components/TipJarIcon.jsx";
import ContactSection from "./components/ContactSection.jsx";
import Comments from "./components/Comments.jsx";
import VideoModal from "./components/VideoModal.jsx";

// ── Main Gallery ───────────────────────────────────────
export default function ClownDanceGallery() {
  const { videos, setVideos, loading } = useVideos();
  const { id: routeVideoId } = useParams();
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [user, setUser]         = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [showAllVideos, setShowAllVideos] = useState(false);
  const [activeTag, setActiveTag] = useState('all');

  useEffect(() => {
    document.title = `${SITE.nameMain} ${SITE.nameAccent} ${SITE.nameSuffix}`;
  }, []);

  useEffect(() => {
    api('/api/auth/me').then(setUser).catch(()=>setUser(null));
  }, []);

  // The /video/:id route is the single source of truth for which video
  // (if any) is open — this keeps `selected` in sync with it, including
  // on browser back/forward, which React Router already handles for us.
  useEffect(() => {
    if (!routeVideoId) { setSelected(null); return; }
    const match = videos.find(v => v.id === parseInt(routeVideoId, 10));
    setSelected(match || null);
  }, [routeVideoId, videos]);

  function openVideo(video) {
    navigate(`/video/${video.id}`);
  }

  function closeVideo() {
    navigate('/');
  }

  function handleVideoUpdated(updated) {
    setVideos(prev => prev.map(v => v.id === updated.id ? { ...v, ...updated } : v));
  }

  function handleVideoDeleted(id) {
    setVideos(prev => prev.filter(v => v.id !== id));
  }

  // Distinct tags currently in use, alphabetical, for the filter bar.
  const tags = [...new Set(videos.map(v => v.tag).filter(Boolean))].sort((a, b) => a.localeCompare(b));
  const tagFilteredVideos = activeTag === 'all' ? videos : videos.filter(v => v.tag === activeTag);
  const visibleVideos = showAllVideos ? tagFilteredVideos : tagFilteredVideos.slice(0, INITIAL_VIDEOS_SHOWN);

  function selectTag(tag) {
    setActiveTag(tag);
    setShowAllVideos(false);
  }


  async function handleSignOut() {
    try { await fetch('/api/auth/logout', { method:'POST', credentials:'include' }); }
    finally { setUser(null); }
  }

  return (
    <div className="page" style={{ '--accent': SITE.accentColor, '--accent-hover': SITE.accentColorHover, '--accent-rgb': hexToRgb(SITE.accentColor) }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,700;9..144,900&family=Inter:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0a0a; }
        .page { background: #0a0a0a; color: #f5f5f5; font-family: 'Inter', sans-serif; min-height: 100vh; padding: 48px 32px 80px; }
        .top-bar { max-width: 1180px; margin: 0 auto 32px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
        .site-title { font-family: 'Fraunces', serif; font-size: clamp(20px,3vw,28px); font-weight: 900; }
        .site-title span { color: var(--accent); }
        .top-bar-right { display: flex; align-items: center; gap: 12px; font-size: 13px; color: #8a8a8a; }
        .top-nav { display: flex; align-items: center; gap: 18px; }
        .top-nav a { color: #8a8a8a; text-decoration: none; font-size: 13px; font-weight: 600; transition: color 0.15s; }
        .top-nav a:hover { color: var(--accent); }
        .header { max-width: 1180px; margin: 0 auto 40px; }
        .header h1 { font-family: 'Fraunces', serif; font-weight: 700; font-size: clamp(26px,4vw,42px); line-height: 1.15; margin-bottom: 8px; }
        .header p { color: #8a8a8a; font-size: 15px; }
        .tag-filter-bar { max-width: 1180px; margin: 0 auto 20px; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        .tag-filter-btn { background: transparent; border: 1px solid #2a2a2a; color: #8a8a8a; font-size: 12px; font-weight: 600; padding: 6px 14px; border-radius: 14px; cursor: pointer; font-family: inherit; transition: all 0.15s; white-space: nowrap; }
        .tag-filter-btn:hover { border-color: #555; color: #f5f5f5; }
        .tag-filter-btn.active { border-color: var(--accent); color: #f5f5f5; background: rgba(var(--accent-rgb),0.1); }
        .grid { max-width: 1180px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px; }
        .card { background: #141414; border: 1px solid #1e1e1e; border-radius: 6px; overflow: hidden; cursor: pointer; text-align: left; padding: 0; color: inherit; font: inherit; transition: transform 0.18s, border-color 0.18s; }
        .card:hover { transform: translateY(-2px); border-color: var(--accent); }
        .card-thumb-wrap { position: relative; aspect-ratio: 16/9; background: #111; overflow: hidden; }
        .card-tag { position: absolute; top: 8px; left: 8px; z-index: 1; background: rgba(0,0,0,0.75); border: 1px solid rgba(255,255,255,0.18); color: var(--accent); font-size: 10px; font-weight: 600; padding: 3px 8px; border-radius: 10px; max-width: calc(100% - 16px); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .card-thumb { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.25s; }
        .card:hover .card-thumb { transform: scale(1.04); }
        .card-thumb-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: #1a1a1a; color: #333; font-size: 32px; }
        .card-stats-bar { position: absolute; bottom: 0; left: 0; right: 0; padding: 6px 10px; background: linear-gradient(transparent, rgba(0,0,0,0.85)); display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: rgba(255,255,255,0.7); }
        .card-stats-left { display: flex; gap: 10px; }
        .card-duration { background: rgba(0,0,0,0.75); color: #fff; padding: 1px 5px; border-radius: 3px; font-weight: 600; font-size: 11px; }
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
        .video-vote-btn.dislike.active { color: var(--accent); }
        .vote-divider { width: 1px; background: #2a2a2a; flex-shrink: 0; }
        .video-share-btn { background: #1e1e1e; border: 1px solid #2a2a2a; color: #f5f5f5; font-size: 13px; padding: 7px 16px; border-radius: 20px; cursor: pointer; font-family: inherit; transition: background 0.15s; }
        .video-share-btn:hover { background: #2a2a2a; }
        .tip-btn { background: var(--accent); border: 1px solid var(--accent); color: #fff; font-size: 13px; font-weight: 600; padding: 7px 16px; border-radius: 20px; cursor: pointer; font-family: inherit; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; transition: background 0.15s, border-color 0.15s; }
        .tip-btn:hover { background: var(--accent-hover); border-color: var(--accent-hover); }
        .hp-field { position: absolute; left: -9999px; width: 1px; height: 1px; opacity: 0; overflow: hidden; }
        .tip-btn-nav { padding: 5px 14px; font-size: 12px; }
        .admin-badge { background: var(--accent); color: #fff; font-size: 10px; font-weight: 700; letter-spacing: 0.05em; padding: 2px 7px; border-radius: 10px; text-transform: uppercase; line-height: 1.4; }
        .pinned-badge { background: transparent; border: 1px solid var(--accent); color: var(--accent); font-size: 10px; font-weight: 700; letter-spacing: 0.05em; padding: 1px 7px; border-radius: 10px; text-transform: uppercase; line-height: 1.4; }
        .sort-bar { display: flex; align-items: center; gap: 4px; flex-wrap: wrap; }
        .sort-btn { background: transparent; border: 1px solid #2a2a2a; color: #555; font-size: 11px; padding: 4px 10px; border-radius: 12px; cursor: pointer; font-family: inherit; transition: all 0.15s; white-space: nowrap; }
        .sort-btn:hover { border-color: #555; color: #f5f5f5; }
        .sort-btn.active { border-color: var(--accent); color: #f5f5f5; background: rgba(var(--accent-rgb),0.1); }
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
        .auth-tabs button.active { border-color: var(--accent); color: #f5f5f5; }
        .auth-form, .comment-form { display: flex; flex-direction: column; gap: 8px; }
        .auth-form input, .comment-form textarea { background: #1a1a1a; border: 1px solid #2a2a2a; border-radius: 4px; color: #f5f5f5; padding: 8px 10px; font-family: inherit; font-size: 13px; outline: none; transition: border-color 0.15s; }
        .auth-form input:focus, .comment-form textarea:focus { border-color: var(--accent); }
        .comment-form textarea { resize: vertical; }
        .auth-form button[type=submit], .comment-form button[type=submit], .btn-primary { background: var(--accent); color: #fff; border: none; border-radius: 4px; padding: 8px 16px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; transition: background 0.15s; align-self: flex-start; }
        .auth-form button:hover, .comment-form button:hover, .btn-primary:hover { background: var(--accent-hover); }
        .auth-form button:disabled, .comment-form button:disabled { opacity: 0.6; cursor: default; }
        .btn-ghost { background: transparent; border: 1px solid #333; color: #8a8a8a; border-radius: 4px; padding: 6px 12px; font-size: 12px; cursor: pointer; font-family: inherit; }
        .link-btn { background: none; border: none; color: var(--accent); font-size: 12px; cursor: pointer; padding: 0; font-family: inherit; }
        .link-btn:hover { text-decoration: underline; }
        .avatar-grid { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; padding: 10px; background: #141414; border: 1px solid #1e1e1e; border-radius: 6px; }
        .avatar-choice { background: none; border: 2px solid transparent; border-radius: 50%; padding: 2px; line-height: 0; cursor: pointer; transition: border-color 0.15s; }
        .avatar-choice:hover { border-color: #555; }
        .avatar-choice.selected { border-color: var(--accent); }
        .avatar-choice:disabled { opacity: 0.6; cursor: default; }
        .vote-btn { background: none; border: 1px solid #2a2a2a; color: #8a8a8a; font-size: 12px; padding: 3px 8px; border-radius: 3px; cursor: pointer; font-family: inherit; transition: all 0.15s; }
        .vote-btn:hover { border-color: #555; color: #f5f5f5; }
        .vote-btn.active-like { border-color: #22c55e; color: #22c55e; background: rgba(34,197,94,0.08); }
        .vote-btn.active-dislike { border-color: var(--accent); color: var(--accent); background: rgba(var(--accent-rgb),0.08); }
        .form-error { color: var(--accent); font-size: 12px; }
        .muted { font-size: 12px; color: #555; }
        .report-modal { background: #1a1a1a; border: 1px solid #2a2a2a; border-radius: 6px; padding: 12px; margin-top: 8px; }
        .add-video-panel { max-width: 1180px; margin: 32px auto 0; background: #141414; border: 1px solid #1e1e1e; border-radius: 6px; padding: 20px; }
        .add-video-panel input { background: #1a1a1a; border: 1px solid #2a2a2a; border-radius: 4px; color: #f5f5f5; padding: 8px 10px; font-family: inherit; font-size: 13px; width: 100%; }
        .empty-state { max-width: 1180px; margin: 60px auto; text-align: center; color: #555; }

        .site-section { max-width: 1180px; margin: 64px auto 0; }
        .site-section-title { font-family: 'Fraunces', serif; font-size: 26px; font-weight: 700; margin-bottom: 20px; }
        .season-subtitle { font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 400; color: #8a8a8a; margin-left: 8px; vertical-align: middle; }
        .faq-list { display: flex; flex-direction: column; gap: 8px; }
        .faq-item { background: #141414; border: 1px solid #1e1e1e; border-radius: 6px; overflow: hidden; }
        .faq-question { width: 100%; display: flex; justify-content: space-between; align-items: center; gap: 12px; background: none; border: none; color: #f5f5f5; font-family: inherit; font-size: 14px; font-weight: 600; padding: 14px 16px; cursor: pointer; text-align: left; }
        .faq-caret { color: var(--accent); font-size: 18px; flex-shrink: 0; }
        .faq-answer { padding: 0 16px 16px; margin: 0; color: #8a8a8a; font-size: 13px; line-height: 1.6; }
        .contact-form { display: flex; flex-direction: column; gap: 10px; }
        .contact-form input, .contact-form textarea { background: #1a1a1a; border: 1px solid #2a2a2a; border-radius: 4px; color: #f5f5f5; padding: 8px 10px; font-family: inherit; font-size: 13px; outline: none; transition: border-color 0.15s; }
        .contact-form input:focus, .contact-form textarea:focus { border-color: var(--accent); }
        .contact-form textarea { resize: vertical; }
        .social-links { display: flex; flex-direction: column; gap: 8px; }
        .social-row { display: flex; align-items: center; gap: 12px; text-decoration: none; color: #f5f5f5; padding: 6px; border-radius: 8px; transition: background 0.15s; }
        .social-row:hover { background: #1a1a1a; }
        .social-row:hover .social-badge { border-color: var(--accent); color: var(--accent); }
        .social-label { font-size: 14px; font-weight: 600; }
        .chat-links { display: flex; flex-direction: column; gap: 10px; }
        .chat-link { display: flex; flex-direction: column; gap: 2px; background: #1a1a1a; border: 1px solid #2a2a2a; border-radius: 6px; padding: 10px 12px; text-decoration: none; color: #f5f5f5; transition: border-color 0.15s; }
        .chat-link:hover { border-color: var(--accent); }
        .chat-link strong { font-size: 13px; }
        .chat-link span { font-size: 12px; color: #8a8a8a; }
        .social-badge { width: 44px; height: 44px; border-radius: 50%; background: #1a1a1a; border: 1px solid #2a2a2a; color: #f5f5f5; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; text-decoration: none; transition: border-color 0.15s, color 0.15s; }
        .social-badge:hover { border-color: var(--accent); color: var(--accent); }
        .social-badge svg { display: block; }
        .social-badge-text { font-family: 'Fraunces', serif; font-size: 17px; font-weight: 900; font-style: italic; line-height: 1; }
        .videos-section { margin-top: 8px; }
        .season-two-banner { max-width: 1180px; margin: 28px auto 0; display: flex; align-items: center; gap: 12px; padding: 16px 20px; background: #141414; border: 1px dashed #2a2a2a; border-radius: 8px; }
        .season-two-banner h3 { font-family: 'Fraunces', serif; font-size: 17px; font-weight: 700; margin: 0; color: #f5f5f5; }
        .coming-soon-badge { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; color: var(--accent); background: rgba(var(--accent-rgb),0.1); border: 1px solid rgba(var(--accent-rgb),0.3); border-radius: 12px; padding: 3px 10px; }
        .section-divider { max-width: 1180px; margin: 56px auto 0; height: 1px; background: linear-gradient(90deg, transparent, #262626 15%, #262626 85%, transparent); }

        /* ── MOBILE RESPONSIVE ── */
        @media (max-width: 600px) {
          .page { padding: 20px 16px 60px; }
          .top-bar { margin-bottom: 20px; }
          .site-title { font-size: 18px; }
          .top-bar-right { font-size: 12px; }
          .top-nav { gap: 12px; font-size: 12px; }
          .top-nav a { font-size: 12px; }
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
          .tip-btn { font-size: 12px; padding: 6px 12px; }
          .comments { padding: 12px 16px 80px; }
          .comments-list { max-height: 240px; }
          .comment { padding: 8px 10px; }
          .auth-panel { padding: 12px; }
          .vote-btn { padding: 2px 6px; font-size: 11px; }
          .add-video-panel { margin: 20px 0 0; padding: 16px; }
          .site-section { margin-top: 40px; }
          .site-section-title { font-size: 20px; }
          .season-subtitle { display: block; margin-left: 0; margin-top: 4px; font-size: 12px; }
          .section-divider { margin-top: 32px; }
          .videos-section { margin-top: 0; }
        }
        @media (max-width: 480px) {
          .grid { grid-template-columns: 1fr; }
        }
        .empty-state p { font-size: 15px; margin-top: 8px; }
      `}</style>

      <div className="top-bar">
        <div className="site-title">{SITE.nameMain} <span>{SITE.nameAccent}</span> {SITE.nameSuffix}</div>
        <nav className="top-nav">
          <a href="#videos">Videos</a>
          <a href="#community">Community</a>
          <a href="#faq">FAQ</a>
          <a href="#contact">Contact</a>
        </nav>
        <div className="top-bar-right">
          <a className="tip-btn tip-btn-nav" href={SITE.tipUrl} target="_blank" rel="noopener noreferrer">
            <TipJarIcon /> Tip Jar
          </a>
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
        <h1>{SITE.heading}</h1>
      </header>

      <section className="site-section videos-section" id="videos">
        <h2 className="site-section-title">Season 1 <span className="season-subtitle">(filmed May–July 2026)</span></h2>

        {loading && <div className="empty-state"><p>Loading videos…</p></div>}

      {!loading && videos.length === 0 && (
        <div className="empty-state">
          <p>No videos yet.{user?.is_admin ? ' Add one below.' : ''}</p>
        </div>
      )}

      {!loading && tags.length > 0 && (
        <div className="tag-filter-bar">
          <button className={`tag-filter-btn ${activeTag==='all'?'active':''}`} onClick={()=>selectTag('all')} type="button">
            All
          </button>
          {tags.map(t => (
            <button key={t} className={`tag-filter-btn ${activeTag===t?'active':''}`} onClick={()=>selectTag(t)} type="button">
              {t}
            </button>
          ))}
        </div>
      )}

      {!loading && videos.length > 0 && tagFilteredVideos.length === 0 && (
        <div className="empty-state">
          <p>No videos tagged "{activeTag}" yet.</p>
        </div>
      )}

      <div className="grid">
        {visibleVideos.map(v => (
          <button key={v.id} className="card" onClick={()=>openVideo(v)}>
            <div className="card-thumb-wrap">
              {v.tag && <span className="card-tag">{v.tag}</span>}
              {v.thumbnail_url
                ? <img className="card-thumb" src={v.thumbnail_url} alt={v.title} loading="lazy" />
                : <div className="card-thumb-placeholder">▶</div>
              }
              <div className="card-stats-bar">
                <span className="card-stats-left">
                  <span>👁 {formatCount(v.view_count)}</span>
                  <span>💬 {formatCount(v.comment_count)}</span>
                </span>
                {formatDuration(v.duration_seconds) && <span className="card-duration">{formatDuration(v.duration_seconds)}</span>}
              </div>
            </div>
            <div className="card-body">
              <h3>{v.title}</h3>
              <span>{formatDate(v.created_at)}</span>
            </div>
          </button>
        ))}
      </div>

      {!showAllVideos && tagFilteredVideos.length > INITIAL_VIDEOS_SHOWN && (
        <div style={{textAlign:'center', maxWidth:1180, margin:'20px auto 0'}}>
          <button className="btn-ghost" onClick={()=>setShowAllVideos(true)} type="button">
            View more videos ({tagFilteredVideos.length - INITIAL_VIDEOS_SHOWN} more)
          </button>
        </div>
      )}

      <div className="season-two-banner">
        <h3>Season 2</h3>
        <span className="coming-soon-badge">Coming soon</span>
      </div>

      {user?.is_admin && (
        <AddVideoPanel onAdded={v => setVideos(prev=>[v,...prev])} />
      )}
      </section>

      <div className="section-divider" />

      <FAQSection />

      <div className="section-divider" />

      <section className="site-section" id="community">
        <h2 className="site-section-title">Join the Conversation</h2>
        <div className="comments" style={{padding:0}}>
          <Comments kind="site" user={user} onAuthed={setUser} onSignOut={handleSignOut} onUpdateUser={setUser} />
        </div>
      </section>

      <div className="section-divider" />

      <ContactSection />

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
          videos={videos}
          onNavigate={openVideo}
          onVideoUpdated={handleVideoUpdated}
          onVideoDeleted={handleVideoDeleted}
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
