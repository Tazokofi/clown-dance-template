-- Manually delete a user's account from the live database, run via
-- scripts/delete-user.sh (which fills in __EMAIL__ and calls this).
--
-- Their comments/site comments are NOT deleted -- they're reassigned to a
-- permanent "Deleted user" placeholder account and their author name is
-- blanked out. This keeps reply threads readable (nobody's left replying
-- to a comment that vanished) while removing every trace tying that
-- content back to them personally. Everything else -- login sessions,
-- their votes, their reports, their raw view-history rows -- is deleted
-- outright, since none of it has any display value once they're gone.
-- (Public counters like a video's view_count or a comment's like_count
-- are separate running totals and are untouched by any of this.)

-- 1. Make sure the placeholder account exists (safe to re-run -- this is
--    a no-op after the first time).
INSERT OR IGNORE INTO users (name, email, password_hash, password_salt, is_admin, is_banned, created_at)
VALUES ('Deleted user', 'deleted-user@internal.local', 'DELETED_ACCOUNT_NO_LOGIN', 'DELETED_ACCOUNT_NO_LOGIN', 0, 1, 0);

-- 2. Re-point their comments at the placeholder account.
UPDATE comments SET
  user_id = (SELECT id FROM users WHERE email = 'deleted-user@internal.local'),
  author  = 'Deleted user'
WHERE user_id = (SELECT id FROM users WHERE email = '__EMAIL__');

UPDATE site_comments SET
  user_id = (SELECT id FROM users WHERE email = 'deleted-user@internal.local'),
  author  = 'Deleted user'
WHERE user_id = (SELECT id FROM users WHERE email = '__EMAIL__');

-- 3. Remove everything else tied to their account.
DELETE FROM sessions             WHERE user_id = (SELECT id FROM users WHERE email = '__EMAIL__');
DELETE FROM video_votes          WHERE user_id = (SELECT id FROM users WHERE email = '__EMAIL__');
DELETE FROM comment_votes        WHERE user_id = (SELECT id FROM users WHERE email = '__EMAIL__');
DELETE FROM comment_reports      WHERE user_id = (SELECT id FROM users WHERE email = '__EMAIL__');
DELETE FROM site_comment_votes   WHERE user_id = (SELECT id FROM users WHERE email = '__EMAIL__');
DELETE FROM site_comment_reports WHERE user_id = (SELECT id FROM users WHERE email = '__EMAIL__');
DELETE FROM views                WHERE user_id = (SELECT id FROM users WHERE email = '__EMAIL__');

-- 4. Finally, delete the account itself.
DELETE FROM users WHERE email = '__EMAIL__';
