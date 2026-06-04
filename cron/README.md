# Meridian cron jobs

Server-side scheduled tasks for Meridian. These are separate from anything
TriPoint runs and touch only Meridian-owned paths.

## What is scheduled

| Job                          | Schedule            | Script                          | Purpose                                                        |
| ---------------------------- | ------------------- | ------------------------------- | -------------------------------------------------------------- |
| InvenTree DB backup          | nightly at 03:30    | `meridian-inventree-backup.sh`  | Rotating compressed dump of the InvenTree database (Docker).   |
| Product cache warm / probe   | every 10 minutes    | `meridian-cache-warm.sh`        | Primes the in-memory catalogue and logs the cache state.       |

certbot certificate renewal is deliberately NOT in cron. It runs on its own
systemd timer (`certbot.timer`); duplicating it here would be a footgun.

## Install

Run on the server (defaults to the root user, matching the TriPoint convention):

```bash
/var/www/meridian/cron/meridian-cron-setup.sh
```

The installer is idempotent: re-running it strips any prior Meridian crontab
lines and re-adds the canonical ones, so it never duplicates entries.

## Conventions

- Absolute script paths in every crontab entry.
- Explicit run-as user (`MERIDIAN_CRON_USER`, default `root`).
- A `flock` lockfile per script prevents overlapping runs.
- Each script redirects its own stdout and stderr to a log under
  `/var/log/meridian`.

## Configuration

The backup script reads these (with defaults) so it matches your InvenTree
docker-compose without code changes:

| Variable                         | Default                            |
| -------------------------------- | ---------------------------------- |
| `INVENTREE_DB_CONTAINER`         | `inventree-db`                     |
| `INVENTREE_DB_USER`              | `pguser`                           |
| `INVENTREE_DB_NAME`              | `inventree`                        |
| `MERIDIAN_BACKUP_DIR`            | `/var/backups/meridian/inventree`  |
| `MERIDIAN_BACKUP_RETENTION_DAYS` | `14`                               |

Set the real container, user and database names in the crontab entry or a
drop-in environment before relying on the backup.
