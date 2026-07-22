#!/usr/bin/env bash
# Walk the whole art debt down over however many daily windows it takes. Every
# 10 min: if the CF quota is open, run a batch (fills ~85 panels, then re-exhausts);
# otherwise wait. Exits when no referenced panel is missing. ~6-day safety cap.
cd "$(dirname "$0")/.."
source ~/.cf_ai
debt() { python3 - <<'P'
import re,os,glob
refs=set()
for f in glob.glob('src/content/*.ts'):
    refs.update(re.findall(r'assets/art/(?:scene|cast)/[A-Za-z0-9_]+\.jpg', open(f).read()))
print(sum(1 for r in refs if not os.path.exists('public/'+r)))
P
}
for i in $(seq 1 864); do
  d=$(debt); [ "$d" -eq 0 ] && { echo "[art] DEBT CLEAR — all panels generated."; exit 0; }
  r=$(curl -s -X POST "https://api.cloudflare.com/client/v4/accounts/$CF_ACCOUNT/ai/run/@cf/black-forest-labs/flux-1-schnell" \
    -H "Authorization: Bearer $CF_TOKEN" -H "Content-Type: application/json" \
    -d '{"prompt":"x","steps":4,"height":256,"width":256}')
  if echo "$r" | grep -q '"image"'; then
    echo "[art] window OPEN $(date -u +%m-%dT%H:%MZ) — $d owed — running batch"
    bash scripts/gen_all.sh
    echo "[art] batch done, now $(debt) owed"
  else
    sleep 600
  fi
done
echo "[art] hit 6-day cap with $(debt) still owed — re-launch to continue"
