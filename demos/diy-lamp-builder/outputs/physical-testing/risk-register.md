# IDB-6E Risk Register

## Heat buildup

- **Risk**: Heat buildup softens the printed shell or damages the LED.
- **Symptom**: Shell too hot to touch, smell, discoloration, or sagging.
- **Likely cause**: Insufficient ventilation, wall thickness too low, high LED power density.
- **Mitigation**: Increase wall thickness, add vents, reduce LED current, use PETG.
- **Next test**: 60-minute heat soak with IR thermometer.

## Glare / direct LED visibility

- **Risk**: Direct LED visible causes discomfort.
- **Symptom**: Bright point source visible when seated.
- **Likely cause**: Diffuser not recessed enough or missing side shield.
- **Mitigation**: Increase diffuser recess depth, add shell brow, frost diffuser.
- **Next test**: Glare review from reading posture.

## Poor diffuser fit

- **Risk**: Diffuser is too loose or too tight.
- **Symptom**: Rattles, falls out, or cannot be installed.
- **Likely cause**: Slot tolerance wrong or print shrinkage.
- **Mitigation**: Print fit-test coupon to verify slot width; adjust CAD by ±0.2 mm.
- **Next test**: Fit-test coupon + full shell assembly.

## Cable strain

- **Risk**: Cable pulls out or breaks at exit.
- **Symptom**: Intermittent power, broken strands, cable movement.
- **Likely cause**: Cable exit radius too small, no strain relief.
- **Mitigation**: Widen cable exit radius, add cable tie anchor, route cable along arm.
- **Next test**: Pull test and 30-minute heat soak.

## Base instability

- **Risk**: Lamp tips over during use.
- **Symptom**: Lamp rocks or falls when adjusted.
- **Likely cause**: Base too small, center of gravity too high.
- **Mitigation**: Widen base, add weight, lower lamp head.
- **Next test**: Stability check with full assembly.

## Print warping

- **Risk**: Warped shell causes poor fit and assembly gaps.
- **Symptom**: Corners lift, base not flat, gaps at seams.
- **Likely cause**: Bed adhesion, cooling, material shrinkage.
- **Mitigation**: Brim, heated bed, enclosed build chamber, PETG.
- **Next test**: First full-shell print with recommended profile.

## Engraving too small

- **Risk**: Text engraving is illegible after FDM.
- **Symptom**: Filled-in letters, inconsistent depth.
- **Likely cause**: Font too small, layer height too large, nozzle too wide.
- **Mitigation**: Increase font size, use 0.2 mm layer height, print coupon text sample.
- **Next test**: Fit-test coupon engraving sample.

## Material softening

- **Risk**: Shell material softens under LED heat.
- **Symptom**: Surface deforms near LED after heat soak.
- **Likely cause**: PLA with high LED density, poor thermal path.
- **Mitigation**: Switch to PETG, improve aluminum channel contact, reduce power.
- **Next test**: 60-minute heat soak + dimensional check.
