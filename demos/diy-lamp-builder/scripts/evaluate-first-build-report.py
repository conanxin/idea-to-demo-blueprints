#!/usr/bin/env python3
import json
import sys
from pathlib import Path

path = Path(sys.argv[1]) if len(sys.argv) > 1 else Path("demos/diy-lamp-builder/outputs/first-build/sample-first-build-report.json")
data = json.loads(path.read_text(encoding="utf-8"))

print("IDB-6H first-build report evaluation")
print(f"- prototype_id: {data.get('prototype_id', 'UNKNOWN')}")
print(f"- shell_style: {data.get('shell_style', 'UNKNOWN')}")
print(f"- readiness_decision: {data.get('readiness_decision', 'PENDING')}")

warnings = []
for group in ["fit_test", "assembly", "measurements"]:
    values = data.get(group, {})
    for k, v in values.items():
        if v in {"WARN", "FAIL", "PENDING"}:
            warnings.append((group, k, v))

if warnings:
    print("- warnings:")
    for group, key, value in warnings:
        print(f"  - {group}.{key}: {value}")
else:
    print("- warnings: none")

print("first-build report evaluation: PASS")
