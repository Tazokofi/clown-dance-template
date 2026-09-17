-- Run in the Cloudflare D1 console (same place as the earlier migration).
ALTER TABLE videos ADD COLUMN duration_seconds INTEGER NOT NULL DEFAULT 0;
