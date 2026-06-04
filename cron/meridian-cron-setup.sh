#!/usr/bin/env bash
#
# Install the Meridian cron jobs idempotently.
#
#   - Nightly InvenTree database backup at 03:30.
#   - Product cache warm / liveness probe every 10 minutes.
#
# Uses absolute script paths, an explicit run-as user, and per-script flock
# lockfiles (inside the scripts) to prevent overlapping runs. Each script
# redirects its own output to a log under /var/log/meridian.
#
# certbot renewal is intentionally NOT installed here: it runs on its own
# systemd timer (certbot.timer). Duplicating it in cron would be a footgun.
#
# Re-running this script yields the exact same crontab (it strips any prior
# Meridian entries before re-adding the canonical ones).

set -euo pipefail

APP_DIR="${MERIDIAN_APP_DIR:-/var/www/meridian}"
CRON_USER="${MERIDIAN_CRON_USER:-root}"

BACKUP_SCRIPT="$APP_DIR/cron/meridian-inventree-backup.sh"
WARM_SCRIPT="$APP_DIR/cron/meridian-cache-warm.sh"

# Sanity: the scripts must exist before we schedule them.
for script in "$BACKUP_SCRIPT" "$WARM_SCRIPT"; do
  if [ ! -f "$script" ]; then
    echo ">>> ERROR: expected script not found: $script" >&2
    exit 1
  fi
done
chmod +x "$BACKUP_SCRIPT" "$WARM_SCRIPT"

BACKUP_ENTRY="30 3 * * * $BACKUP_SCRIPT"
WARM_ENTRY="*/10 * * * * $WARM_SCRIPT"

# Read the existing crontab (empty if none), drop any prior Meridian lines,
# then append the canonical entries.
current="$(crontab -u "$CRON_USER" -l 2>/dev/null || true)"
filtered="$(printf '%s\n' "$current" | grep -vF "$BACKUP_SCRIPT" | grep -vF "$WARM_SCRIPT" || true)"
{
  printf '%s\n' "$filtered" | sed '/^[[:space:]]*$/d'
  echo "$BACKUP_ENTRY"
  echo "$WARM_ENTRY"
} | crontab -u "$CRON_USER" -

echo ">>> Meridian cron installed for user '$CRON_USER':"
crontab -u "$CRON_USER" -l | grep -F "$APP_DIR/cron/" || true
