-- Run in the Cloudflare D1 console, same as the earlier migrations.
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
  created_at    INTEGER NOT NULL
);

CREATE TABLE site_comment_votes (
  comment_id INTEGER NOT NULL REFERENCES site_comments(id),
  user_id    INTEGER NOT NULL REFERENCES users(id),
  vote       INTEGER NOT NULL,
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
