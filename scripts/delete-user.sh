#!/usr/bin/env bash
# Delete a user's account from the live database, per the site's Privacy
# Policy ("contact us to delete your account"). Reassigns their comments
# to a "Deleted user" placeholder (see delete-user.sql for why), removes
# everything else tied to them, then deletes their account row.
#
# Usage: ./scripts/delete-user.sh someone@example.com
set -euo pipefail

EMAIL="${1:-}"
if [ -z "$EMAIL" ]; then
  echo "Usage: $0 <email>"
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TMP="$(mktemp)"
trap 'rm -f "$TMP"' EXIT

ESCAPED_EMAIL="$(printf '%s' "$EMAIL" | sed 's/[&/\]/\\&/g')"
sed "s/__EMAIL__/$ESCAPED_EMAIL/g" "$SCRIPT_DIR/delete-user.sql" > "$TMP"

echo "About to permanently delete the account for: $EMAIL"
echo "(their comments will be kept but reassigned to a 'Deleted user' placeholder)"
read -r -p "Type that email address again to confirm: " CONFIRM
if [ "$CONFIRM" != "$EMAIL" ]; then
  echo "Confirmation didn't match -- aborted, nothing was changed."
  exit 1
fi

npx wrangler d1 execute clown_gallery --remote --file="$TMP"
echo "Done -- $EMAIL has been deleted."
