# Future Roadmap

## Track A -- IDB-7: City Night Light Builder

Goal: prove that the compiler pattern works beyond reading lamps.

Candidate product:

- Fixed Core: LampCore-01 low-power night-light module
- Variable Shell: city skyline / architecture silhouette / engraving
- Validation: diffusion, low heat, material translucency
- Build Package: lower-risk BOM than ReadingCore-01
- Sourcing: low-power LED module, translucent filament, simple base

Why next:

- close to DIY Lamp Builder
- lower power than reading lamp
- easier physical validation
- good for cultural product / souvenir direction

## Track B -- Real Prototype Build

Goal: build one physical ReadingCore-01 prototype.

Steps:

1. Review IDB-6G sourcing candidates.
2. Pick one LED strip, one aluminum channel, one diffuser, one adapter, one dimmer.
3. Buy only one prototype set.
4. Print fit-test coupon.
5. Print shell.
6. Assemble ReadingCore-01 cassette.
7. Run IDB-6E lux / heat / glare workflow.
8. Fill first-build report.
9. Decide iteration.

## Track C -- Compiler Platform Extraction

Goal: turn DIY Lamp Builder into a generic product compiler module.

Possible outputs:

- standalone compiler schema
- generic UI for fixed-core / variable-shell products
- product-type templates
- agent prompt library
- export adapters for OpenSCAD / SVG / JSON
- reusable validation pack

## Track D -- Chinese UI Polish, Later

Current status:

- static shell is partly Chinese-first
- app runtime is safe but may contain English dynamic strings
- previous broad localization damaged JavaScript identifiers

Rule for future UI polish:

- never use broad string replacement
- only localize through an explicit render dictionary
- preserve object keys, identifiers, schema keys, and generated JSON keys
- run localization integrity guard after every change
