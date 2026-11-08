#!/bin/sh
# Save a new Figma personal access token into .env without echoing it, then run the pending spec pull.
# Run from a real terminal: sh tools/set-figma-token.sh
cd "$(dirname "$0")/.." || exit 1
printf "Paste Figma token, then Enter: "
stty -echo 2>/dev/null; read -r T; stty echo 2>/dev/null; echo
[ -z "$T" ] && { echo "No token entered. Nothing changed."; exit 1; }
if grep -q '^FIGMA_TOKEN=' .env 2>/dev/null; then
  sed -i '' "s|^FIGMA_TOKEN=.*|FIGMA_TOKEN=$T|" .env
else
  echo "FIGMA_TOKEN=$T" >> .env
fi
unset T
echo "Saved to .env."
[ -f tools/spec-pending.sh ] && sh tools/spec-pending.sh
