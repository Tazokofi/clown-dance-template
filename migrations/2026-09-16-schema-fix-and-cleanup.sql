-- Run this against the LIVE database via the Cloudflare dashboard's
-- D1 console (Workers & Pages → D1 → clown_gallery → Console), or with
-- `wrangler d1 execute clown_gallery --remote --file=migrations/2026-09-16-schema-fix-and-cleanup.sql`
-- from a terminal that's logged in with `wrangler login`.
--
-- Deploy the matching code (this commit) BEFORE or immediately after
-- running this — the new login/signup code expects password_salt to exist.

-- ── 1. REQUIRED: add the column the new salted-password hashing needs ──
ALTER TABLE users ADD COLUMN password_salt TEXT;

-- ── 2. Drop the old unused "likes" table (replaced by comment_votes) ──
DROP TABLE IF EXISTS likes;

-- ── 3. Clear out the test videos/comments/votes (confirmed test data) ──
DELETE FROM comment_votes;
DELETE FROM comment_reports;
DELETE FROM comments;
DELETE FROM video_votes;
DELETE FROM views;
DELETE FROM videos;

-- ── 4. Existing accounts ──
-- Any account created before this migration has password_salt = NULL and
-- can no longer log in (the app will tell them to sign up again) — this
-- is the trade-off of switching to salted hashing, mentioned up front.
--
-- Simplest path: just sign up again through the site after deploying,
-- then run this to make that new account an admin:
--
--   UPDATE users SET is_admin = 1 WHERE email = 'you@example.com';
--
-- Optionally also remove the old, now-unusable test account(s):
--
--   DELETE FROM sessions;
--   DELETE FROM users WHERE password_salt IS NULL;
