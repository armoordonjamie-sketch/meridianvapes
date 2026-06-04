#!/usr/bin/env bash
#
# Meridian: warm the product cache and act as a lightweight liveness probe.
#
# Hits the API over localhost so the in-memory catalogue is primed and any
# InvenTree problem shows up in this log early. Optional: ordinary storefront
# traffic also keeps the cache warm. Safe to re-run; overlapping runs are
# prevented with flock. Localhost only; holds no secrets.

set -euo pipefail
export PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

LOG_FILE="${MERIDIAN_CACHE_WARM_LOG:-/var/log/meridian/cache-warm.log}"
LOCK_FILE="/var/lock/meridian-cache-warm.lock"
API_BASE="${MERIDIAN_API_BASE:-http://127.0.0.1:8010}"

mkdir -p "$(dirname "$LOG_FILE")"
exec >>"$LOG_FILE" 2>&1

exec 200>"$LOCK_FILE"
flock -n 200 || exit 0

echo ">>> [$(date '+%F %T')] Warming product cache via $API_BASE"
if curl -fsS -o /dev/null "$API_BASE/api/products"; then
  echo ">>> [$(date '+%F %T')] products endpoint ok"
else
  echo ">>> [$(date '+%F %T')] WARNING: products endpoint fetch failed"
fi
# Record the cache state line for monitoring.
curl -fsS "$API_BASE/api/health" || echo ">>> [$(date '+%F %T')] WARNING: health fetch failed"
echo
