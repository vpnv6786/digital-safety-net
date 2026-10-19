#!/usr/bin/env bash
# Apply new migrations to the Supabase database with plain psql (no Supabase CLI).
#   DATABASE_URL=postgresql://...  ./scripts/migrate.sh            apply
#   DATABASE_URL=postgresql://...  ./scripts/migrate.sh --dry-run  list what would run
#
# Migrations before MIGRATE_FROM (default 20261019000000) were applied by the old
# Lovable setup and are skipped. Each newer file runs in its own transaction and
# is recorded in private.applied_migrations, so running this twice is safe.
set -euo pipefail
cd "$(dirname "$0")/.."

: "${DATABASE_URL:?Set DATABASE_URL to the Supabase connection string (Session pooler)}"
FROM="${MIGRATE_FROM:-20261019000000}"
DRY_RUN=false
[ "${1:-}" = "--dry-run" ] && DRY_RUN=true

psql_q() { psql "$DATABASE_URL" -X -q -v ON_ERROR_STOP=1 "$@"; }

psql_q -c "create schema if not exists private;
           create table if not exists private.applied_migrations (name text primary key, applied_at timestamptz not null default now());
           revoke all on schema private from public;
           revoke all on private.applied_migrations from public;" >/dev/null

applied="$(psql_q -At -c 'select name from private.applied_migrations')"
pending=0
for file in supabase/migrations/*.sql; do
  name="$(basename "$file" .sql)"
  [[ "$name" < "$FROM" ]] && continue
  grep -qxF "$name" <<<"$applied" && continue
  pending=$((pending + 1))
  if $DRY_RUN; then
    echo "would apply $name"
    continue
  fi
  echo "applying $name"
  { cat "$file"; printf '\ninsert into private.applied_migrations (name) values (%s);\n' "'$name'"; } |
    psql_q --single-transaction -f - >/dev/null
done
echo "$pending migration(s) $($DRY_RUN && echo 'pending' || echo 'applied')"
