#!/usr/bin/env bash
set -euo pipefail

SCAD_FILE="${1:-demos/diy-lamp-builder/outputs/cad-validation/fit-test-coupon.scad}"
OUT_FILE="${2:-/tmp/idb-6d-fit-test-coupon.stl}"

if ! command -v openscad >/dev/null 2>&1; then
  echo "SKIP: openscad CLI not installed."
  echo "Install OpenSCAD locally, then run:"
  echo "  openscad -o \"$OUT_FILE\" \"$SCAD_FILE\""
  exit 0
fi

openscad -o "$OUT_FILE" "$SCAD_FILE"
test -s "$OUT_FILE"
echo "Fit-test coupon STL export PASS: $OUT_FILE"
