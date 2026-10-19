#!/usr/bin/env bash
# Run every migration on a throwaway local PostgreSQL, then the RLS and RPC tests.
# Needs PostgreSQL 15+ binaries (initdb, pg_ctl, psql) on PATH or in /usr/lib/postgresql/*/bin.
set -euo pipefail
cd "$(dirname "$0")/.."

PG_BIN="${PG_BIN:-$(ls -d /usr/lib/postgresql/*/bin 2>/dev/null | sort -V | tail -1)}"
export PATH="$PG_BIN:$PATH"
DATA="$(mktemp -d)"
PORT="${PGPORT_TEST:-54329}"
SOCK="$DATA/sock"
mkdir -p "$SOCK"
trap 'pg_ctl -D "$DATA/db" -m immediate stop >/dev/null 2>&1 || true; rm -rf "$DATA"' EXIT

RUN_AS=()
if [ "$(id -u)" = "0" ]; then
  chown -R postgres "$DATA"
  RUN_AS=(runuser -u postgres --)
fi

"${RUN_AS[@]}" initdb -D "$DATA/db" -U postgres --auth=trust >/dev/null
"${RUN_AS[@]}" pg_ctl -D "$DATA/db" -o "-p $PORT -k $SOCK -c listen_addresses=''" -w start >/dev/null

psql_run() { "${RUN_AS[@]}" psql -X -q -v ON_ERROR_STOP=1 -h "$SOCK" -p "$PORT" -U postgres -d postgres "$@"; }

psql_run -f supabase/tests/supabase_stub.sql >/dev/null
for f in supabase/migrations/*.sql; do
  fixture="supabase/tests/fixtures/$(basename "$f" .sql).before.sql"
  if [ -f "$fixture" ]; then
    echo "fixture $(basename "$fixture")"
    psql_run -f "$fixture" >/dev/null
  fi
  echo "migrate $(basename "$f")"
  psql_run -f "$f" >/dev/null
done
# migrate.sh must be a no-op on a database that already has every migration recorded.
psql_run -c "create table if not exists private.applied_migrations (name text primary key, applied_at timestamptz not null default now())" >/dev/null
for f in supabase/migrations/*.sql; do
  psql_run -c "insert into private.applied_migrations (name) values ('$(basename "$f" .sql)') on conflict do nothing" >/dev/null
done
echo "migrate $(DATABASE_URL="postgresql://postgres@/postgres?host=$SOCK&port=$PORT" "${RUN_AS[@]}" env PATH="$PATH" ./scripts/migrate.sh)"

for f in supabase/tests/*.test.sql; do
  echo "test    $(basename "$f")"
  psql_run -f "$f"
done
# Fresh database that only has the old Lovable schema: migrate.sh applies the new files once.
psql_run -c "create database migrate_check" >/dev/null
psql_mc() { "${RUN_AS[@]}" psql -X -q -v ON_ERROR_STOP=1 -h "$SOCK" -p "$PORT" -U postgres -d migrate_check "$@"; }
# Roles already exist cluster-wide; run the stub without stopping on those errors.
"${RUN_AS[@]}" psql -X -q -h "$SOCK" -p "$PORT" -U postgres -d migrate_check -f supabase/tests/supabase_stub.sql >/dev/null 2>&1
for f in supabase/migrations/2025*.sql; do psql_mc -f "$f" >/dev/null; done
MC_URL="postgresql://postgres@/migrate_check?host=$SOCK&port=$PORT"
first="$("${RUN_AS[@]}" env PATH="$PATH" DATABASE_URL="$MC_URL" ./scripts/migrate.sh | tail -1)"
second="$("${RUN_AS[@]}" env PATH="$PATH" DATABASE_URL="$MC_URL" ./scripts/migrate.sh | tail -1)"
expected="$(ls supabase/migrations/*.sql | grep -vc '/2025')"
[ "$first" = "$expected migration(s) applied" ] || { echo "migrate.sh first run: $first (expected $expected)"; exit 1; }
[ "$second" = "0 migration(s) applied" ] || { echo "migrate.sh second run: $second"; exit 1; }
echo "migrate.sh: applied $expected new migrations once, then nothing"

echo "database tests passed"
