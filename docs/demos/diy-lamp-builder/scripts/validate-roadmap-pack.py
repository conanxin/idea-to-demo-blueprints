#!/usr/bin/env python3
from pathlib import Path
import json
import sys

base = Path("demos/diy-lamp-builder/outputs/roadmap")
required = [
    "README.md",
    "future-roadmap.md",
    "paused-state.md",
    "next-phase-plan.json",
    "handoff-notes.md",
    "roadmap-acceptance-checklist.md",
]

missing = [f for f in required if not (base / f).exists()]
if missing:
    print("MISSING roadmap files:", missing)
    sys.exit(1)

plan = json.loads((base / "next-phase-plan.json").read_text(encoding="utf-8"))
assert plan["phase"] == "IDB-6I.1"

tracks = [t["id"] for t in plan["recommended_next_tracks"]]
for required_track in ["IDB-7", "REAL-BUILD-1", "COMPILER-EXTRACT-1"]:
    assert required_track in tracks, required_track

paused = (base / "paused-state.md").read_text(encoding="utf-8")
for needle in ["workf低", "colorTemperature", "check-js-localization-integrity"]:
    assert needle in paused, needle

print("IDB-6I.1 roadmap pack validation: PASS")
