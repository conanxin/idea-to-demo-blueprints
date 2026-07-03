#!/usr/bin/env python3
from pathlib import Path
import json
import sys
base = Path("demos/diy-lamp-builder/outputs/first-build")
required = [
    "README.md",
    "first-build-runbook.md",
    "first-build-report-template.md",
    "first-build-report-template.json",
    "assembly-photo-shot-list.md",
    "build-day-checklist.md",
    "troubleshooting-guide.md",
    "prototype-iteration-decision.md",
    "sample-first-build-report.json",
]
missing = [f for f in required if not (base / f).exists()]
if missing:
    print("MISSING first-build files:", missing)
    sys.exit(1)

template = json.loads((base / "first-build-report-template.json").read_text(encoding="utf-8"))
assert template["phase"] == "IDB-6H"
assert template["core"] == "ReadingCore-01"
assert template["not_certification"] is True
for key in ["components", "fit_test", "assembly", "measurements", "readiness_decision"]:
    assert key in template, key

sample = json.loads((base / "sample-first-build-report.json").read_text(encoding="utf-8"))
assert sample["phase"] == "IDB-6H"
assert sample["not_certification"] is True
assert "readiness_decision" in sample

text = (base / "first-build-runbook.md").read_text(encoding="utf-8")
for needle in ["Fit-test coupon", "ReadingCore-01 cassette", "First power-on", "Report and iteration decision"]:
    assert needle in text, needle

print("IDB-6H first-build pack validation: PASS")
