#!/bin/sh
# Spec frames built in Figma on 2026-11-08 that still need a Spec tab on the site.
# Needs FIGMA_TOKEN in .env. Run once, then commit js/specs.js:  sh tools/spec-pending.sh
cd "$(dirname "$0")/.." || exit 1
while read -r node id; do
  node tools/figma-spec-extract.mjs "$node" --id "$id" || exit 1
done <<LIST
4707:60 radio-button
4707:246 toggle
4707:433 slider
4707:635 date-picker
4707:820 file-uploader
4707:1013 tag
4707:1205 card
4707:1405 avatar
4707:1596 progress
4707:1785 tabs
4707:1975 breadcrumb
4707:2162 pagination
4707:2354 side-navigation
4707:2545 modal
4707:2769 tooltip
4707:2957 popover
4707:3176 accordion
4707:3368 divider
LIST
node tools/figma-sync-check.mjs
