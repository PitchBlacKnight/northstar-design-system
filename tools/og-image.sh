#!/bin/sh
# Rebuild assets/og-northstar.jpg from tools/og-image.html. Needs the site served locally:
#   python3 -m http.server 8910   (from the repo root), then: sh tools/og-image.sh
set -e
CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
TMP="$(mktemp -d)"
"$CHROME" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 --window-size=1200,630 \
  --virtual-time-budget=9000 --screenshot="$TMP/og.png" "http://localhost:${PORT:-8910}/tools/og-image.html" >/dev/null 2>&1
sips -s format jpeg -s formatOptions 86 "$TMP/og.png" --out assets/og-northstar.jpg >/dev/null
rm -rf "$TMP"
echo "wrote assets/og-northstar.jpg"
