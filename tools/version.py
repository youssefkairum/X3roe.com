#!/usr/bin/env python3
"""Cache-bust local CSS/JS: rewrite every "/assets/<path>" reference in *.html to
"/assets/<path>?v=<content hash>", so browsers and Cloudflare fetch the new file
after each deploy instead of reusing an old cached copy."""
import glob, hashlib, os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)

versions = {}
for path in glob.glob("assets/css/*.css") + glob.glob("assets/js/*.js"):
    with open(path, "rb") as f:
        versions["/" + path] = hashlib.sha1(f.read()).hexdigest()[:10]

pattern = re.compile(r'"(/assets/(?:css|js)/[^"?]+)(?:\?v=[0-9a-f]+)?"')
changed = 0
for page in glob.glob("*.html"):
    text = open(page, encoding="utf-8").read()
    new = pattern.sub(lambda m: f'"{m.group(1)}?v={versions[m.group(1)]}"' if m.group(1) in versions else m.group(0), text)
    if new != text:
        open(page, "w", encoding="utf-8").write(new)
        changed += 1
print(f"version.py: {len(versions)} assets versioned, {changed} pages updated")
