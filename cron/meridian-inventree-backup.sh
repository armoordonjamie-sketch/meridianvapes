#!/usr/bin/env bash
#
# Meridian: nightly backup of the self-hosted InvenTree database.
#
# InvenTree runs in Docker on this box and owns its own data. This protects it
# with a rotating, compressed dump. Safe to re-run; overlapping runs are
# prevented with flock. It holds no secrets: the database credentials live in
# the InvenTree container's own environment, and pg_dump runs inside the
# container, so no password is ever stored in or passed by this script.

set -euo pipefail
# cron has a minimal PATH; set a sane one so docker/gzip/find resolve.
export PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

# --- Configuration (override via environment) --------------------------------
BACKUP_DIR="${MERIDIAN_BACKUP_DIR:-/var/backups/meridian/inventree}"
LOG_FILE="${MERIDIAN_BACKUP_LOG:-/var/log/meridian/inventree-backup.log}"
LOCK_FILE="/var/lock/meridian-inventree-backup.lock"
RETENTION_DAYS="${MERIDIAN_BACKUP_RETENTION_DAYS:-14}"

# InvenTree Postgres container details. Match your InvenTree docker-compose.
DB_CONTAINER="${INVENTREE_DB_CONTAINER:-inventree-db}"
DB_USER="${INVENTREE_DB_USER:-pguser}"
DB_NAME="${INVENTREE_DB_NAME:-inventree}"

TIMESTAMP="$(date +%Y%m%d-%H%M%S)"
DEST="$BACKUP_DIR/inventree-$TIMESTAMP.sql.gz"
TMP="$DEST.tmp"

mkdir -p "$BACKUP_DIR" "$(dirname "$LOG_FILE")"
exec >>"$LOG_FILE" 2>&1

# Prevent overlapping runs.
exec 200>"$LOCK_FILE"
flock -n 200 || { echo ">>> [$(date '+%F %T')] Another backup is running; skipping."; exit 0; }

# Clean up a half-written temp file on any exit.
cleanup() { [ -f "$TMP" ] && rm -f "$TMP" || true; }
trap cleanup EXIT

echo ">>> [$(date '+%F %T')] Backing up InvenTree DB '$DB_NAME' from container '$DB_CONTAINER'"
# pg_dump runs INSIDE the container; credentials never leave it.
docker exec -t "$DB_CONTAINER" pg_dump -U "$DB_USER" "$DB_NAME" | gzip > "$TMP"
mv "$TMP" "$DEST"
echo ">>> [$(date '+%F %T')] Wrote $DEST ($(du -h "$DEST" | cut -f1))"

# Rotate: delete dumps older than the retention window.
find "$BACKUP_DIR" -name 'inventree-*.sql.gz' -type f -mtime +"$RETENTION_DAYS" -delete
echo ">>> [$(date '+%F %T')] Pruned backups older than $RETENTION_DAYS days."
