# IDB-6E Physical Prototype Testing Pack

This pack is the next step after IDB-6D Print Validation. It provides a low-cost, first-prototype measurement workflow for the DIY Lamp Builder / ReadingCore-01 shell.

## Goal

Give a first physical prototype a structured set of checks before committing to a full build: lux grid, heat soak, glare review, and a readiness gate.

## Workflow

```
Idea → Config → SVG → OpenSCAD → CAD Validation → Fit-Test Coupon → Slicer Profile → Physical Prototype → Lux Grid → Heat Soak → Glare Review → Readiness Gate
```

## Steps

1. Print the fit-test coupon from IDB-6D and verify M3 holes, diffuser slot, cable exit, and engraving legibility.
2. Print the full shell using the slicer profile in IDB-6D.
3. Install ReadingCore-01 into the shell.
4. Complete the **Lux Test Grid** at a reading distance of 35–45 cm.
5. Run the **30-minute heat soak**; extend to 60 minutes if the shell feels warm but safe.
6. Complete the **Glare Review** from normal seated reading posture.
7. Fill in the **Measurement Log** and **Prototype Readiness Checklist**.
8. Decide: iterate CAD / diffuser / cable exit, or proceed to a full build.

## Files in this pack

- `lux-heat-glare-test-protocol.md` — full test protocol
- `measurement-log-template.csv` — CSV template
- `measurement-log-template.md` — human-readable measurement log
- `prototype-readiness-checklist.md` — checklist
- `physical-readiness-report-template.json` — report template
- `risk-register.md` — known risks and mitigations
- `sample-physical-test-report.json` — example mock report

## Important limits

- This is **not** a certified photometric, thermal, or electrical safety test.
- It does **not** replace UL, CCC, IEC, GB, or any local electrical safety certification.
- Phone lux apps are acceptable for trend-only checks only.
- No medical or eye-safety claims are made.
- Read the full safety disclaimer in the main blueprint.
