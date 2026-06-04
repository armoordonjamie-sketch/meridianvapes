#!/usr/bin/env bash
#
# Meridian Vapes deploy script.
#
# Builds the storefront, installs backend dependencies, runs any migrations,
# restarts ONLY the Meridian systemd unit, then tests and reloads nginx.
#
# It only ever touches Meridian-owned files, ports and units. It never touches
# any TriPoint (TPD) unit, server block or config, and it holds no secrets:
# INVENTREE_URL and INVENTREE_TOKEN live in the gitignored
# backend/.env on the server and are read by systemd, not by this script.
#
# Idempotent and safe to re-run.

set -euo pipefail

# --- Configuration (override via environment) --------------------------------
APP_DIR="${MERIDIAN_APP_DIR:-/var/www/meridian}"
FRONTEND_DIR="$APP_DIR/site"
BACKEND_DIR="$APP_DIR/backend"
VENV_DIR="$APP_DIR/venv"
BRANCH="${MERIDIAN_BRANCH:-main}"

SERVICE="meridian-api"          # Meridian systemd unit. NEVER tripoint-api.
NGINX_SITE="meridian"           # Meridian nginx site. NEVER tripoint / default.

UNIT_TEMPLATE="$APP_DIR/deploy/meridian-api.service"
NGINX_TEMPLATE="$APP_DIR/deploy/nginx/meridian.conf"

LOG_DIR="${MERIDIAN_LOG_DIR:-/var/log/meridian}"
TIMESTAMP="$(date +%Y%m%d-%H%M%S)"
LOG_FILE="$LOG_DIR/deploy-$TIMESTAMP.log"

mkdir -p "$LOG_DIR"
# Log everything to console and a timestamped file.
exec > >(tee -a "$LOG_FILE") 2>&1

log() { echo ">>> [$(date '+%F %T')] $*"; }

log "Meridian deploy starting (app_dir=$APP_DIR branch=$BRANCH service=$SERVICE)"

# --- Safety guard: never run against a TriPoint tree -------------------------
case "$APP_DIR" in
  *tripoint*|*TriPoint*)
    log "Refusing to run: APP_DIR ($APP_DIR) looks like a TriPoint path."
    exit 1
    ;;
esac

# --- 1. Pull latest ----------------------------------------------------------
log "Fetching and fast-forwarding origin/$BRANCH"
cd "$APP_DIR"
git fetch --prune origin "$BRANCH"
git checkout "$BRANCH"
# Fast-forward only: never creates a merge commit, no-op when already current.
git merge --ff-only "origin/$BRANCH"

# --- 2. Build the frontend into the static dir -------------------------------
log "Building storefront in $FRONTEND_DIR"
cd "$FRONTEND_DIR"

# Build-time Vite env (public VITE_ vars only, never secrets). If the server has
# a repo-level config, use it; otherwise fall back to any existing file.
if [ -f "$APP_DIR/config/frontend.env" ]; then
  cp "$APP_DIR/config/frontend.env" "$FRONTEND_DIR/.env.production"
  log "Loaded Vite env from $APP_DIR/config/frontend.env"
elif [ -f "$FRONTEND_DIR/.env.production" ]; then
  log "Using existing $FRONTEND_DIR/.env.production"
else
  log "WARNING: no frontend .env.production found; build uses code defaults (VITE_API_BASE_URL may be empty)."
fi

if [ -f package-lock.json ]; then
  npm ci
else
  log "WARNING: no package-lock.json; falling back to npm install."
  npm install
fi
npm run build   # outputs to $FRONTEND_DIR/dist

# --- 3. Backend virtualenv and dependencies ----------------------------------
log "Installing backend dependencies into $VENV_DIR"
if [ ! -d "$VENV_DIR" ]; then
  python3 -m venv "$VENV_DIR"
fi
"$VENV_DIR/bin/pip" install --upgrade pip
"$VENV_DIR/bin/pip" install -r "$BACKEND_DIR/requirements.txt"

# --- 4. Migrations -----------------------------------------------------------
# The integration layer is stateless (in-memory cache only). InvenTree owns its
# own database and migrations inside Docker. This hook runs project migrations
# only if a tool is configured, so it stays a no-op today and future proof.
log "Checking for migrations"
if [ -f "$BACKEND_DIR/alembic.ini" ]; then
  log "Running alembic migrations"
  ( cd "$BACKEND_DIR" && "$VENV_DIR/bin/alembic" upgrade head )
else
  log "No migrations configured (stateless integration layer); skipping."
fi

# --- 5. Install/refresh the Meridian systemd unit (Meridian-owned only) ------
if [ -f "$UNIT_TEMPLATE" ]; then
  if ! cmp -s "$UNIT_TEMPLATE" "/etc/systemd/system/$SERVICE.service" 2>/dev/null; then
    log "Installing/updating systemd unit $SERVICE.service"
    install -m 0644 "$UNIT_TEMPLATE" "/etc/systemd/system/$SERVICE.service"
    systemctl daemon-reload
  fi
  systemctl enable "$SERVICE" >/dev/null 2>&1 || true
fi

# --- 6. Restart ONLY the Meridian unit ---------------------------------------
log "Restarting $SERVICE"
systemctl restart "$SERVICE"

# --- 7. Ensure the Meridian nginx site exists (Meridian-owned only) ----------
# Only write the server block on first provisioning. Once it exists we leave it
# alone so that certbot's TLS edits (the 443 block) are never clobbered.
if [ -f "$NGINX_TEMPLATE" ]; then
  if [ ! -f "/etc/nginx/sites-available/$NGINX_SITE" ]; then
    log "Installing nginx server block $NGINX_SITE (first provisioning)"
    install -m 0644 "$NGINX_TEMPLATE" "/etc/nginx/sites-available/$NGINX_SITE"
  else
    log "nginx server block $NGINX_SITE already present; leaving it untouched."
  fi
  # Enable the Meridian site only. Never remove default or the TriPoint symlink.
  ln -sf "/etc/nginx/sites-available/$NGINX_SITE" "/etc/nginx/sites-enabled/$NGINX_SITE"
fi

# --- 8. Test nginx, reload only if the test passes ---------------------------
log "Testing nginx configuration"
if nginx -t; then
  log "nginx -t passed; reloading nginx"
  systemctl reload nginx
else
  log "nginx -t FAILED; NOT reloading. Investigate before retrying."
  exit 1
fi

log "Meridian deploy complete. Log: $LOG_FILE"
