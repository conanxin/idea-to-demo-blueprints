# Paused State

## Current completed phase

IDB-6I / IDB-6I.1 closeout

## Current repository state

- DIY Lamp Builder is a complete demo-ready physical-product compiler reference.
- No new Blueprint should be added for this closeout.
- App runtime should remain untouched unless a specific bug is found.
- GitHub Pages may lag behind source; raw main is the source of truth.

## Important caution

Do not run broad Chinese localization over JavaScript files.

Known bad patterns from previous attempts:

- workflow -> workf低
- highlight -> 高light
- colorTemperature -> color温度
- cable_exit -> cable_出口
- low/high object keys translated

Always run:

```bash
python3 demos/diy-lamp-builder/scripts/check-js-localization-integrity.py
node --check demos/diy-lamp-builder/app/app.js
```

## Safe next restart point

Start with either:

- IDB-7 City Night Light Builder, or
- Real Prototype Build Track for ReadingCore-01
