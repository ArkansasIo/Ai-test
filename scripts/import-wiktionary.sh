#!/usr/bin/env bash
set -euo pipefail

# Downloads a current Wiktionary dump and imports it through the project's
# dictionary ingestion pipeline. Keep raw dumps outside Git; they are large.
LANGUAGE="${1:-en}"
DUMP_URL="https://dumps.wikimedia.org/${LANGUAGE}wiktionary/latest/${LANGUAGE}wiktionary-latest-pages-articles.xml.bz2"
OUT_DIR="${DICTIONARY_DUMP_DIR:-./data/dictionary}"
mkdir -p "$OUT_DIR"
FILE="$OUT_DIR/${LANGUAGE}wiktionary-latest-pages-articles.xml.bz2"

curl -fL --retry 3 "$DUMP_URL" -o "$FILE"
echo "Downloaded $FILE"
echo "Run the dictionary parser/import worker against this dump."
