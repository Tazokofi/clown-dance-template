-- ── Users & authentication ──────────────────────────────
CREATE TABLE users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  name          TEXT NOT NULL,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  password_salt TEXT NOT NULL,
  avatar_url    TEXT,
  is_admin      INTEGER NOT NULL DEFAULT 0,
  is_banned     INTEGER NOT NULL DEFAULT 0,
  created_at    INTEGER NOT NULL
);

CREATE TABLE sessions (
  token      TEXT PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id),
  created_at INTEGER NOT NULL
);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);

-- Rate limiting for login/signup endpoints. `kind` is 'login' or 'signup';
-- `identifier` is the email (login) or IP address (signup).
CREATE TABLE auth_attempts (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  kind       TEXT NOT NULL,
  identifier TEXT NOT NULL,
  created_at INTEGER NOT NULL
);
CREATE INDEX idx_auth_attempts_lookup ON auth_attempts(kind, identifier, created_at);

-- ── Videos ───────────────────────────────────────────────
CREATE TABLE videos (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  title          TEXT NOT NULL,
  description    TEXT NOT NULL DEFAULT '',
  bunny_video_id TEXT NOT NULL,
  thumbnail_url  TEXT NOT NULL DEFAULT '',
  duration_seconds INTEGER NOT NULL DEFAULT 0,
  view_count     INTEGER NOT NULL DEFAULT 0,
  like_count     INTEGER NOT NULL DEFAULT 0,
  dislike_count  INTEGER NOT NULL DEFAULT 0,
  comment_count  INTEGER NOT NULL DEFAULT 0,
  -- Short free-form label shown on the card, e.g. "Freestyle / Venice
  -- Beach" or "Convos / Monologues" -- lets visitors browse by act
  -- style/location instead of just the title.
  tag            TEXT NOT NULL DEFAULT '',
  -- Soft delete -- an admin removing a video just flips this rather than
  -- wiping the row, so nothing (its comments/votes/view history) is lost
  -- if it was clicked by accident. Deleted videos are excluded from the
  -- public /api/videos list.
  is_deleted     INTEGER NOT NULL DEFAULT 0,
  created_at     INTEGER NOT NULL
);

CREATE TABLE video_votes (
  video_id   INTEGER NOT NULL REFERENCES videos(id),
  user_id    INTEGER NOT NULL REFERENCES users(id),
  vote       INTEGER NOT NULL, -- 1 = like, -1 = dislike
  created_at INTEGER NOT NULL,
  UNIQUE (video_id, user_id)
);

-- One row per counted view. NULLable user_id / device_token so a
-- logged-in view and an anonymous view can't double-count the same source.
CREATE TABLE views (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  video_id     INTEGER NOT NULL REFERENCES videos(id),
  user_id      INTEGER REFERENCES users(id),
  device_token TEXT,
  created_at   INTEGER NOT NULL,
  UNIQUE (video_id, user_id),
  UNIQUE (video_id, device_token)
);

-- ── Comments ─────────────────────────────────────────────
CREATE TABLE comments (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  video_id      INTEGER NOT NULL REFERENCES videos(id),
  user_id       INTEGER NOT NULL REFERENCES users(id),
  parent_id     INTEGER REFERENCES comments(id),
  author        TEXT NOT NULL,
  text          TEXT NOT NULL,
  like_count    INTEGER NOT NULL DEFAULT 0,
  dislike_count INTEGER NOT NULL DEFAULT 0,
  report_count  INTEGER NOT NULL DEFAULT 0,
  is_hidden     INTEGER NOT NULL DEFAULT 0,
  is_deleted    INTEGER NOT NULL DEFAULT 0,
  -- Admin can pin one top-level comment per video so it always shows first,
  -- above the sort order visitors pick (newest/oldest/top).
  is_pinned     INTEGER NOT NULL DEFAULT 0,
  created_at    INTEGER NOT NULL
);
CREATE INDEX idx_comments_video_id ON comments(video_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);

CREATE TABLE comment_votes (
  comment_id INTEGER NOT NULL REFERENCES comments(id),
  user_id    INTEGER NOT NULL REFERENCES users(id),
  vote       INTEGER NOT NULL, -- 1 = like, -1 = dislike
  created_at INTEGER NOT NULL,
  UNIQUE (comment_id, user_id)
);

CREATE TABLE comment_reports (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  comment_id INTEGER NOT NULL REFERENCES comments(id),
  user_id    INTEGER NOT NULL REFERENCES users(id),
  reason     TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  UNIQUE (comment_id, user_id)
);

-- ── Site-wide comments (a general discussion thread, not tied to a video) ──
CREATE TABLE site_comments (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id       INTEGER NOT NULL REFERENCES users(id),
  parent_id     INTEGER REFERENCES site_comments(id),
  author        TEXT NOT NULL,
  text          TEXT NOT NULL,
  like_count    INTEGER NOT NULL DEFAULT 0,
  dislike_count INTEGER NOT NULL DEFAULT 0,
  report_count  INTEGER NOT NULL DEFAULT 0,
  is_hidden     INTEGER NOT NULL DEFAULT 0,
  is_deleted    INTEGER NOT NULL DEFAULT 0,
  -- Admin can pin one top-level comment (e.g. an intro/welcome message) so
  -- it always shows first, above the sort order visitors pick.
  is_pinned     INTEGER NOT NULL DEFAULT 0,
  created_at    INTEGER NOT NULL
);

CREATE TABLE site_comment_votes (
  comment_id INTEGER NOT NULL REFERENCES site_comments(id),
  user_id    INTEGER NOT NULL REFERENCES users(id),
  vote       INTEGER NOT NULL, -- 1 = like, -1 = dislike
  created_at INTEGER NOT NULL,
  UNIQUE (comment_id, user_id)
);

CREATE TABLE site_comment_reports (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  comment_id INTEGER NOT NULL REFERENCES site_comments(id),
  user_id    INTEGER NOT NULL REFERENCES users(id),
  reason     TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  UNIQUE (comment_id, user_id)
);
