# IDB-6E Lux / Heat / Glare Test Protocol

## Scope

First physical prototype measurement for the DIY Lamp Builder reading desk lamp. Not a certification or lab test.

## Test setup

- Complete the IDB-6D fit-test coupon and full-shell print first.
- Install ReadingCore-01 into the shell.
- Place the lamp at normal reading height.
- Position an open book or reading surface 35–45 cm from the lamp head.
- Run tests in a ventilated, room-temperature environment.

## Tools

- Lux meter (preferred) or phone lux app (trend only)
- Infrared or contact thermometer (optional)
- Timer
- Measurement log sheet or CSV
- Notebook for qualitative observations

## Lux grid protocol

1. Turn the lamp on and wait 2 minutes for stable output.
2. Measure illuminance at the following points on the reading surface:
   - Center
   - Left page
   - Right page
   - Front edge
   - Back edge
3. Record values in the measurement log.
4. Pass rules:
   - Center >= 300 lux
   - No reading-zone point below 200 lux
   - Warn if center-to-edge ratio is too uneven

## Heat soak protocol

1. Run the lamp at normal power in a ventilated room.
2. Record observations at 0, 30, and optionally 60 minutes.
3. Measurement points:
   - Aluminum channel
   - Printed shell near LED
   - Diffuser edge
   - Base / controller
   - Cable exit
4. Pass rule:
   - No softening, warping, smell, discoloration, or uncomfortable touch temperature.
5. If the shell is too hot to touch comfortably, reduce power or improve cooling.

## Glare review protocol

1. Sit at normal reading posture.
2. Distance from book: 35–45 cm.
3. Check the following:
   - Direct LED is not visible.
   - Diffuser is recessed or shielded.
   - No sharp hot spot on paper.
   - No harsh reflection on glossy page.
   - Shadow does not block reading.
4. Record PASS, WARN, or FAIL for each item.

## Pass / Warn / Fail interpretation

- **PASS**: All critical checks pass. Prototype can proceed to full build or minor cosmetic refinement.
- **WARN**: One or more non-critical checks are borderline. Iterate CAD, diffuser, or thermal path before a full build.
- **FAIL**: Critical safety or usability issue. Stop and redesign the relevant part.

## Not a certification

This protocol is for hobbyist prototyping only. It does not certify the lamp for sale, installation, or any safety standard.
