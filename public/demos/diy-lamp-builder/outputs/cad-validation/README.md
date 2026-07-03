# IDB-6D CAD Validation + Print Orientation + Slicer Profile

This demo pack folder holds first-prototype validation artifacts for the DIY Lamp Builder.
It extends IDB-6C CAD Export toward a real FDM print: CAD validation, print orientation, slicer profile baseline, fit-test coupon, and measurement log templates.

## What IDB-6D is / is not

**IDB-6D is:**
- A pre-print checklist layer on top of the existing OpenSCAD export.
- Shell-specific print-orientation and slicer guidance.
- A small fit-test coupon to validate critical dimensions before committing to a full shell.
- A measurement log to record real print results.

**IDB-6D is NOT:**
- Engineering certification or structural sign-off.
- Electrical, thermal, or safety testing.
- A guarantee that the printed shell will fit the real ReadingCore-01 module.

## Recommended workflow

1. Generate the OpenSCAD shell in the demo app and download `shell_export.scad`.
2. Download `fit-test-coupon.scad` from the Print Validation section.
3. If OpenSCAD CLI is installed, export STLs:
   ```bash
   openscad -o fit-test-coupon.stl fit-test-coupon.scad
   openscad -o shell_export.stl shell_export.scad
   ```
4. Load the STL in PrusaSlicer or Cura and apply the baseline profile in this folder.
5. Print the fit-test coupon first.
6. Measure the M3 hole ladder, diffuser slot ladder, aluminum channel clearance, and cable exit radius.
7. Record results in `measured-fit-test-log-template.csv` or `.md`.
8. Decide whether to adjust the CAD before printing the full shell.

## Files

- `cad-validation-rules.json` — numeric thresholds and nominal dimensions.
- `print-orientation-guide.md` — orientation advice per shell style.
- `slicer-profile-prusaslicer.ini` — minimal PrusaSlicer-style baseline.
- `slicer-profile-cura.md` — human-readable Cura equivalent.
- `fit-test-coupon.scad` — printable OpenSCAD test piece.
- `measured-fit-test-log-template.csv` — CSV measurement log.
- `measured-fit-test-log-template.md` — Markdown measurement log.
- `validation-report-template.json` — template for final validation status.

## Path notes

These files are mirrored under `demos/`, `docs/demos/`, and `public/demos/` so the GitHub Pages site and the local demo pack stay in sync.

## Limitations

- All dimensions are baseline suggestions. Tolerance depends on printer, filament, slicer, and environment.
- No thermal simulation or LED derating data is provided.
- No legal or electrical safety claims are made.
