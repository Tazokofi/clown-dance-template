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
  created_at    INTEGER NOT NULL
);
CREATE INDEX idx_comments_video_id ON comments(video_id);

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
