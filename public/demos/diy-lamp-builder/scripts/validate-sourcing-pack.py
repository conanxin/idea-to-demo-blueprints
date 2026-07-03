#!/usr/bin/env python3
from pathlib import Path
import csv
import json
import sys

base = Path("demos/diy-lamp-builder/outputs/sourcing")
required = [
    "README.md",
    "real-component-candidates.csv",
    "real-component-candidates.json",
    "supplier-shortlist.md",
    "purchase-search-keywords.md",
    "first-prototype-shopping-list.md",
    "supplier-risk-notes.md",
    "sourcing-decision-matrix.csv",
    "source-notes.md",
]
missing = [f for f in required if not (base / f).exists()]
if missing:
    print("MISSING sourcing files:", missing)
    sys.exit(1)

data = json.loads((base / "real-component-candidates.json").read_text(encoding="utf-8"))
assert data["phase"] == "IDB-6G"
assert data["not_final_purchase_recommendation"] is True
assert len(data["candidates"]) >= 6

with (base / "real-component-candidates.csv").open(encoding="utf-8") as f:
    rows = list(csv.DictReader(f))
assert len(rows) >= 8
for field in ["category", "component", "candidate_name", "supplier_or_platform", "observed_price_usd", "source_url", "key_specs", "risks"]:
    assert field in rows[0], field

text = (base / "purchase-search-keywords.md").read_text(encoding="utf-8")
for needle in ["24V 高显色 COB 灯带", "LED aluminum channel opal diffuser", "M3 热熔铜螺母"]:
    assert needle in text, needle

print("IDB-6G sourcing pack validation: PASS")
