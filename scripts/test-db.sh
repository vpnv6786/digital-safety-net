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
for f in supabase/tests/*.test.sql; do
  echo "test    $(basename "$f")"
  psql_run -f "$f"
done
echo "database tests passed"
