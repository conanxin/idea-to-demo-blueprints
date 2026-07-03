# IDB-6D Print Orientation Guide

This guide maps each DIY Lamp Builder shell style to a recommended first-prototype print orientation and support strategy.

## General assumptions

- Printer: consumer FDM, 0.4 mm nozzle.
- Material: PETG for functional prototypes; PLA+ for visual mocks.
- All shells are printed with the back face on the bed unless noted.
- A brim is recommended for long, thin shells.

## Minimal Bar

- **Orientation:** Diffuser opening facing upward or side-up.
- **Support strategy:** Usually no support, or minimal support for cable exit.
- **Bed contact:** Flat back on build plate.
- **Risk level:** Low.
- **Recommended first print:** Yes — start here if you are new to this design.
- **Why:** Boxy geometry, flat back, and minimal overhangs make this the easiest shell to print reliably.

## Hutong Window

- **Orientation:** Back face on bed, grille facing upward.
- **Support strategy:** Moderate supports for grille details and mullions.
- **Bed contact:** Flat back on build plate.
- **Risk level:** Medium.
- **Recommended first print:** Print fit-test coupon first.
- **Why:** The window grille creates small bridges and overhangs. Support cleanup is needed around mullions.

## Beijing Pavilion

- **Orientation:** Roof ridge upward, flat back on bed.
- **Support strategy:** Likely supports for the tiered roof and eaves.
- **Bed contact:** Flat back on build plate.
- **Risk level:** High.
- **Recommended first print:** Print fit-test coupon and a small roof section before the full shell.
- **Why:** The tiered roof and eaves create large overhangs. Layer adhesion and support placement are critical.

## Book Arc

- **Orientation:** Arc upward, diffuser side controlled.
- **Support strategy:** Moderate supports under the curved arc.
- **Bed contact:** Flat back on build plate.
- **Risk level:** Medium-high.
- **Recommended first print:** Print fit-test coupon first.
- **Why:** Curved surfaces produce visible layer lines and support scars. Arc orientation must balance strength and surface quality.

## Material notes

- **PETG:** More ductile and heat-tolerant than PLA; good for a functional first prototype. Slightly stringier.
- **PLA+:** Better surface finish and easier to print; acceptable for visual mock-ups. Avoid heat and moisture.

## Next step

After selecting orientation and material, apply the slicer profile in this folder, print the fit-test coupon, and record measurements before printing the full shell.
