#!/usr/bin/env python3
"""IDB-6E physical testing pack validator — stdlib only."""
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PT_DIR = ROOT / "outputs" / "physical-testing"
APP_JS = ROOT / "app" / "app.js"

REQUIRED_FILES = [
    "README.md",
    "lux-heat-glare-test-protocol.md",
    "measurement-log-template.csv",
    "measurement-log-template.md",
    "prototype-readiness-checklist.md",
    "physical-readiness-report-template.json",
    "risk-register.md",
    "sample-physical-test-report.json",
]

CSV_REQUIRED_HEADERS = [
    "lux_center",
    "heat_30_min_aluminum_c",
    "direct_led_visible",
    "pass_warn_fail",
    "next_adjustment",
]

RISK_KEYWORDS = [
    "heat buildup",
    "glare",
    "diffuser fit",
    "cable strain",
    "base instability",
    "print warping",
    "engraving",
    "material softening",
]

JS_NEEDLES = [
    "buildLuxTestPlan",
    "buildHeatSoakPlan",
    "buildGlareReview",
    "buildPhysicalReadinessReport",
]


def check_files():
    for name in REQUIRED_FILES:
        p = PT_DIR / name
        assert p.exists(), f"missing {p}"
        assert p.stat().st_size > 0, f"empty {p}"


def check_csv():
    csv = (PT_DIR / "measurement-log-template.csv").read_text(encoding="utf-8")
    header = csv.splitlines()[0]
    for col in CSV_REQUIRED_HEADERS:
        assert col in header, f"missing CSV column: {col}"


def check_json_template():
    data = json.loads((PT_DIR / "physical-readiness-report-template.json").read_text(encoding="utf-8"))
    assert data.get("phase") == "IDB-6E", "phase must be IDB-6E"
    assert data.get("not_certification") is True, "not_certification must be true"
    assert "readiness_gate" in data, "readiness_gate required"


def check_risk_register():
    text = (PT_DIR / "risk-register.md").read_text(encoding="utf-8").lower()
    for kw in RISK_KEYWORDS:
        assert kw in text, f"missing risk keyword: {kw}"


def check_app_js():
    js = APP_JS.read_text(encoding="utf-8")
    for needle in JS_NEEDLES:
        assert needle in js, f"missing JS function: {needle}"


def main():
    try:
        check_files()
        check_csv()
        check_json_template()
        check_risk_register()
        check_app_js()
    except AssertionError as e:
        print(f"IDB-6E physical test pack: FAIL — {e}")
        return 1
    print("IDB-6E physical test pack: PASS")
    return 0


if __name__ == "__main__":
    sys.exit(main())
