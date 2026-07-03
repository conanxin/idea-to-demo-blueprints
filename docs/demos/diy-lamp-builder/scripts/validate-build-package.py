#!/usr/bin/env python3
from pathlib import Path
import csv
import json
import sys

base = Path("demos/diy-lamp-builder/outputs/build-package")
required = [
    "README.md",
    "purchase-ready-bom.csv",
    "purchase-ready-bom.json",
    "component-spec-sheet.md",
    "sourcing-checklist.md",
    "first-prototype-assembly-runbook.md",
    "supplier-risk-register.md",
    "quote-comparison-template.csv",
    "purchase-decision-gate.md",
    "first-build-issue-log.md",
]
missing = [f for f in required if not (base / f).exists()]
if missing:
    print("MISSING build package files:", missing)
    sys.exit(1)

bom = json.loads((base / "purchase-ready-bom.json").read_text(encoding="utf-8"))
assert bom["phase"] == "IDB-6F"
assert bom["core"] == "ReadingCore-01"
assert bom["not_certification"] is True
assert len(bom["bom"]) >= 6
assert "estimated_total_usd" in bom

with (base / "purchase-ready-bom.csv").open(encoding="utf-8") as f:
    rows = list(csv.DictReader(f))
assert len(rows) >= 6
for field in ["category", "item", "minimum_spec", "recommended_spec", "estimate_low_usd", "estimate_high_usd"]:
    assert field in rows[0], field

text = (base / "sourcing-checklist.md").read_text(encoding="utf-8")
for needle in ["24V", "CRI90", "LED 铝槽", "opal diffuser", "M3"]:
    assert needle in text, needle

print("IDB-6F build package validation: PASS")
