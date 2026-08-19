#!/usr/bin/env bash
# Nightly Postgres dump. The catalog and every order live in the tsomi_pgdata
# Docker volume — if that volume goes, so does the shop's entire order history.
#
# Install on the VPS with:
#   sudo crontab -e
#   15 3 * * * /root/tsomi/scripts/backup-db.sh >> /var/log/tsomi-backup.log 2>&1
set -euo pipefail

cd "$(dirname "$0")/.."

BACKUP_DIR="${BACKUP_DIR:-/var/backups/tsomi}"
KEEP_DAYS="${KEEP_DAYS:-14}"

# POSTGRES_USER / POSTGRES_DB live in .env.production alongside the password.
set -a
# shellcheck disable=SC1091
source .env.production
set +a

mkdir -p "$BACKUP_DIR"
stamp="$(date -u +%Y%m%d-%H%M%S)"
target="$BACKUP_DIR/tsomi-$stamp.sql.gz"

docker compose --env-file .env.production -f docker-compose.prod.yml exec -T db \
	pg_dump -U "${POSTGRES_USER:-tsomi}" "${POSTGRES_DB:-tsomi}" | gzip >"$target"

# A zero-length dump means pg_dump failed inside the pipe — don't let it sit
# there looking like a valid backup.
if [ ! -s "$target" ]; then
	echo "$(date -u +%FT%TZ) BACKUP FAILED: $target is empty" >&2
	rm -f "$target"
	exit 1
fi

# Product photos live in the uploads volume, not in git — a database dump alone
# would restore a catalog whose every image 404s.
#
# Tarred from inside the container rather than by mounting the volume by name:
# compose prefixes volume names with the project, so a hardcoded `-v
# tsomi_uploads` would quietly create a new empty volume and back up nothing.
uploads="$BACKUP_DIR/uploads-$stamp.tar.gz"
docker compose --env-file .env.production -f docker-compose.prod.yml exec -T web \
	tar czf - -C /app/uploads . >"$uploads"

if [ ! -s "$uploads" ]; then
	echo "$(date -u +%FT%TZ) BACKUP FAILED: $uploads is empty" >&2
	rm -f "$uploads"
	exit 1
fi

find "$BACKUP_DIR" -name 'tsomi-*.sql.gz' -mtime "+$KEEP_DAYS" -delete
find "$BACKUP_DIR" -name 'uploads-*.tar.gz' -mtime "+$KEEP_DAYS" -delete

echo "$(date -u +%FT%TZ) backup ok: $target ($(du -h "$target" | cut -f1)), $uploads ($(du -h "$uploads" | cut -f1))"
