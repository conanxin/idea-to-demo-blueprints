#!/usr/bin/env python3
import json
from pathlib import Path

bom_path = Path("demos/diy-lamp-builder/outputs/build-package/purchase-ready-bom.json")
bom = json.loads(bom_path.read_text(encoding="utf-8"))

low = 0
high = 0
for item in bom["bom"]:
    lo, hi = item["estimate_usd"]
    low += lo
    high += hi

print(f"IDB-6F estimated first prototype BOM: ${low}-{high} USD")
print("Note: estimate only; verify with real suppliers before purchase.")
