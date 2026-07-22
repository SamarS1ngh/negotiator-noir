#!/usr/bin/env bash
# Fill the whole art debt on Cloudflare, RESUMABLY. Runs every per-mission gen
# script; the skip-if-exists guard in each means a run only makes the panels still
# missing and no-ops everything already on disk — so re-running each day (when the
# free quota resets) walks the debt down until it's clear. Old Pollinations bulk
# scripts no-op here because their files already exist.
cd "$(dirname "$0")/.."
for s in scripts/gen_*.sh; do
  case "$s" in scripts/gen_all.sh) continue ;; esac
  echo "===== $s ====="
  bash "$s" || true
done
echo "===== art pass done — remaining debt: ====="
python3 - <<'PY'
import re, os, glob
refs = set()
for f in glob.glob('src/content/*.ts'):
    for m in re.findall(r'assets/art/(?:scene|cast)/[A-Za-z0-9_]+\.jpg', open(f).read()):
        refs.add(m)
missing = [r for r in refs if not os.path.exists('public/' + r)]
print(f"{len(missing)} panels still owed (re-run scripts/gen_all.sh next quota window)")
PY
