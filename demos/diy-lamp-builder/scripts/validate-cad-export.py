#!/usr/bin/env python3
"""validate-cad-export.py — IDB-6D CAD validation script.

Checks that the expected OpenSCAD files, JSON rules, and slicer profile exist
and contain the required modules / thresholds. Optionally exports STLs if
OpenSCAD CLI is installed.

Python standard library only.
"""

import json
import os
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CAD_DIR = ROOT / "outputs" / "cad"
VAL_DIR = ROOT / "outputs" / "cad-validation"
TMP_DIR = Path("/tmp")

REQUIRED_FILES = [
    CAD_DIR / "sample-hutong-window-shell.scad",
    CAD_DIR / "readingcore-01-keepout.scad",
    VAL_DIR / "fit-test-coupon.scad",
    VAL_DIR / "cad-validation-rules.json",
    VAL_DIR / "slicer-profile-prusaslicer.ini",
]

REQUIRED_SCAD_MODULES = {
    CAD_DIR / "sample-hutong-window-shell.scad": [
        "readingcore_keepout",
        "diffuser_slot",
        "m3_mount_holes",
        "cable_exit",
        "shell_hutong_window",
    ],
    CAD_DIR / "readingcore-01-keepout.scad": ["readingcore_keepout"],
    VAL_DIR / "fit-test-coupon.scad": [
        "m3_hole_ladder",
        "diffuser_slot_ladder",
        "cable_exit_test",
        "engraving_sample",
        "fit_test_coupon",
    ],
}


def check_file(path: Path) -> None:
    if not path.exists():
        print(f"MISSING: {path}")
        sys.exit(1)
    print(f"FOUND: {path}")


def check_scad_modules(path: Path, required: list) -> None:
    text = path.read_text(encoding="utf-8")
    missing = [m for m in required if f"module {m}" not in text]
    if missing:
        print(f"MISSING modules in {path}: {missing}")
        sys.exit(1)
    print(f"PASS modules in {path}")


def check_json_rules(path: Path) -> None:
    data = json.loads(path.read_text(encoding="utf-8"))
    wall_min = data.get("wall_thickness", {}).get("minimum_mm")
    if wall_min is None or wall_min < 2.0:
        print(f"FAIL: wall_thickness.minimum_mm must be >= 2.0, got {wall_min}")
        sys.exit(1)
    m3 = data.get("m3_mount_holes", {}).get("nominal_diameter_mm")
    if m3 != 3.2:
        print(f"FAIL: m3 nominal diameter must be 3.2, got {m3}")
        sys.exit(1)
    widths = data.get("diffuser_slot", {}).get("test_widths_mm", [])
    if 18.0 not in widths:
        print(f"FAIL: diffuser test widths must include 18.0, got {widths}")
        sys.exit(1)
    print(f"PASS JSON rules in {path}")


def check_ini(path: Path) -> None:
    text = path.read_text(encoding="utf-8")
    required = [
        "layer_height = 0.2",
        "perimeters = 3",
        "top_solid_layers = 5",
        "bottom_solid_layers = 5",
        "fill_density = 18%",
        "brim_width = 5",
    ]
    missing = [r for r in required if r not in text]
    if missing:
        print(f"MISSING ini lines in {path}: {missing}")
        sys.exit(1)
    print(f"PASS ini in {path}")


def try_stl_export(scad_file: Path, stl_file: Path) -> str:
    if not os.environ.get("OPENSCAD_PATH", ""):
        # check common names
        for cmd in ["openscad", "OpenSCAD"]:
            try:
                result = subprocess.run(
                    [cmd, "--version"],
                    stdout=subprocess.PIPE,
                    stderr=subprocess.STDOUT,
                    check=True,
                )
                os.environ["OPENSCAD_PATH"] = cmd
                break
            except (subprocess.CalledProcessError, FileNotFoundError):
                continue
    cmd = os.environ.get("OPENSCAD_PATH", "")
    if not cmd:
        return "SKIP"
    subprocess.run(
        [cmd, "-o", str(stl_file), str(scad_file)],
        check=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
    )
    if not stl_file.exists() or stl_file.stat().st_size == 0:
        print(f"FAIL: exported STL is empty: {stl_file}")
        sys.exit(1)
    return "PASS"


def main() -> int:
    print(f"[IDB-6D CAD validation] root={ROOT}")
    print("--- Required files ---")
    for f in REQUIRED_FILES:
        check_file(f)

    print("--- SCAD modules ---")
    for path, modules in REQUIRED_SCAD_MODULES.items():
        check_scad_modules(path, modules)

    print("--- Rules / profile ---")
    check_json_rules(VAL_DIR / "cad-validation-rules.json")
    check_ini(VAL_DIR / "slicer-profile-prusaslicer.ini")

    print("--- Optional OpenSCAD STL export ---")
    fit_stl = TMP_DIR / "idb-6d-fit-test-coupon.stl"
    hutong_stl = TMP_DIR / "idb-6d-sample-hutong-window-shell.stl"
    fit_result = try_stl_export(VAL_DIR / "fit-test-coupon.scad", fit_stl)
    hutong_result = try_stl_export(CAD_DIR / "sample-hutong-window-shell.scad", hutong_stl)
    if fit_result == "PASS" and hutong_result == "PASS":
        print(f"OpenSCAD STL export: PASS ({fit_stl}, {hutong_stl})")
    else:
        print(f"OpenSCAD STL export: SKIP (fit={fit_result}, hutong={hutong_result})")
        print("Install OpenSCAD locally to enable STL export.")

    print("IDB-6D CAD validation: PASS")
    return 0


if __name__ == "__main__":
    sys.exit(main())
