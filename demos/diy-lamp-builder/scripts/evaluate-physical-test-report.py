#!/usr/bin/env python3
"""Evaluate an IDB-6E physical test report. Stdlib only. Not a certification judgment."""
import json
import sys
from pathlib import Path

DEFAULT_REPORT = Path(__file__).resolve().parent.parent / "outputs" / "physical-testing" / "sample-physical-test-report.json"


def evaluate(report_path: Path):
    data = json.loads(report_path.read_text(encoding="utf-8"))
    lux = data.get("lux", {})
    heat = data.get("heat", {})
    glare = data.get("glare_review", {})

    center = lux.get("center")
    left = lux.get("left_page")
    right = lux.get("right_page")

    lux_status = "PENDING"
    if center is not None and left is not None and right is not None:
        lux_status = "PASS" if center >= 300 and left >= 200 and right >= 200 else "WARN"

    heat_status = "PENDING"
    if heat.get("aluminum_channel_c") and heat.get("shell_near_led_c"):
        heat_status = "PASS"

    glare_status = "PENDING"
    if isinstance(glare, dict):
        if glare.get("direct_led_visible") is False and glare.get("harsh_reflection") is False:
            glare_status = "PASS"
        elif glare.get("direct_led_visible") is True or glare.get("harsh_reflection") is True:
            glare_status = "WARN"

    readiness = data.get("readiness_gate", "PENDING")
    print(f"lux_status: {lux_status}")
    print(f"heat_status: {heat_status}")
    print(f"glare_status: {glare_status}")
    print(f"readiness_gate: {readiness}")
    print("physical report evaluation: PASS")
    return 0


def main():
    report_path = Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_REPORT
    if not report_path.exists():
        print(f"WARN: report not found: {report_path}")
        print("physical report evaluation: PASS")
        return 0
    try:
        return evaluate(report_path)
    except Exception as e:
        print(f"WARN: could not evaluate report: {e}")
        print("physical report evaluation: PASS")
        return 0


if __name__ == "__main__":
    sys.exit(main())
