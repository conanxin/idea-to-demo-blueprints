# Cura Slicer Profile for DIY Lamp Builder IDB-6D

Use these values as a starting point in Cura 5.x. Calibrate per filament and printer.

## Layer Height

- **Layer Height:** 0.20 mm
- **Initial Layer Height:** 0.24 mm

## Walls

- **Wall Line Count:** 3
- **Wall Thickness:** 1.2 mm

## Top/Bottom

- **Top Thickness:** 1.0 mm
- **Bottom Thickness:** 1.0 mm
- **Top Layers:** 5
- **Bottom Layers:** 5

## Infill

- **Infill Density:** 18%
- **Infill Pattern:** Grid or Gyroid

## Support

- **Generate Support:** Yes for Hutong Window, Beijing Pavilion, Book Arc; No for Minimal Bar
- **Support Placement:** Everywhere (or Touching Buildplate if overhangs are small)
- **Support Overhang Angle:** 55°
- **Support Interface:** Recommended for easy removal on visible surfaces

## Adhesion

- **Build Plate Adhesion Type:** Brim
- **Brim Width:** 5 mm
- **Brim Line Count:** 8

## Speed

- **Print Speed:** 50 mm/s
- **Wall Speed:** 45 mm/s
- **Top/Bottom Speed:** 40 mm/s
- **Initial Layer Speed:** 20 mm/s

## Travel

- **Avoid Printed Parts when Traveling:** Yes
- **Z Hop When Retracted:** Yes (helps avoid collisions with tall thin shells)

## Material: PLA+

- **Printing Temperature:** 200–210 °C
- **Build Plate Temperature:** 55–60 °C

## Material: PETG

- **Printing Temperature:** 235–245 °C
- **Build Plate Temperature:** 75–85 °C

## Quality tweaks

- Enable **Coasting** and tune retraction to reduce PETG stringing.
- Set **Z seam** to "Back" or user-defined coordinate near the rear of the shell.

## Print order

1. Fit-test coupon
2. Full shell after measurements pass
