#!/usr/bin/env python3
from pathlib import Path
import re
import sys

FILES = [
    Path("demos/diy-lamp-builder/app/app.js"),
    Path("docs/demos/diy-lamp-builder/app/app.js"),
    Path("public/demos/diy-lamp-builder/app/app.js"),
]

BAD_FRAGMENTS = [
    "workf低",
    "高light",
    "color温度",
    "cable_出口",
    "shell_高",
    "core_电源",
    "reading_目标",
    "assembly_步骤",
    "print_验证",
    "physical_测试",
    "validation_报告",
    "download文本File",
]

BAD_KEY_PATTERNS = [
    re.compile(r"([{,]\s*)低\s*:"),
    re.compile(r"([{,]\s*)高\s*:"),
    re.compile(r"\.低\b"),
    re.compile(r"\.高\b"),
]

REQUIRED_IDENTIFIERS = [
    "workflow",
    "highlight",
    "colorTemperature",
    "cable_exit",
    "low",
    "high",
    "calculateBom",
    "generateOpenScad",
    "validateCadParams",
    "buildLuxTestPlan",
    "buildHeatSoakPlan",
    "buildGlareReview",
    "downloadMeasurementLogCsv",
]

errors = []

for path in FILES:
    if not path.exists():
        errors.append(f"MISSING {path}")
        continue

    text = path.read_text(encoding="utf-8")

    for frag in BAD_FRAGMENTS:
        if frag in text:
            errors.append(f"{path}: bad fragment found: {frag}")

    for pat in BAD_KEY_PATTERNS:
        if pat.search(text):
            errors.append(f"{path}: bad key pattern found: {pat.pattern}")

    for ident in REQUIRED_IDENTIFIERS:
        if ident not in text:
            errors.append(f"{path}: required identifier missing: {ident}")

if errors:
    print("JS localization integrity: FAIL")
    for err in errors:
        print("-", err)
    sys.exit(1)

print("JS localization integrity: PASS")
