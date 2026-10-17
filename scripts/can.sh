#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

usage() {
  cat <<'EOF'
AI-Test command runner

Usage: ./scripts/can.sh <command>

Commands:
  install     Install Node dependencies
  typecheck   Run TypeScript type checking
  build       Build TypeScript output
  test        Run the configured test suite
  dev         Start the development entry point
  clean       Remove generated dist output
  all         Run typecheck, build, and tests
EOF
}

case "${1:-}" in
  install) npm install ;;
  typecheck) npm run typecheck ;;
  build) npm run build ;;
  test) npm test ;;
  dev) npm run dev ;;
  clean) rm -rf dist ;;
  all) npm run typecheck && npm run build && npm test ;;
  *) usage; exit 2 ;;
esac
