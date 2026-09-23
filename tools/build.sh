#!/bin/sh
# Rebuild assets/css/site.css from the HTML/JS sources.
# Needs the Tailwind v3 standalone CLI: https://github.com/tailwindlabs/tailwindcss/releases/tag/v3.4.17
# (download tailwindcss-<os>-<arch>, chmod +x, and save it as tools/bin/tailwindcss, put it on PATH, or set $TAILWIND).
set -e
cd "$(dirname "$0")/.."
if [ -z "$TAILWIND" ] && [ -x tools/bin/tailwindcss ]; then TAILWIND=tools/bin/tailwindcss; fi
TAILWIND="${TAILWIND:-tailwindcss}"
python3 tools/icons.py
"$TAILWIND" -c tailwind.config.js -i src/site.css -o assets/css/site.css --minify
