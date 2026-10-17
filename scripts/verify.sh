#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

./scripts/can.sh typecheck
./scripts/can.sh build
./scripts/can.sh test

echo "AI-Test verification completed successfully."
