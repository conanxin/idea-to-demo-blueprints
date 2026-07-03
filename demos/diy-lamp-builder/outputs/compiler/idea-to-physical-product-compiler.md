# Idea-to-Physical-Product Compiler

## Definition

The Idea-to-Physical-Product Compiler is a workflow that converts a natural-language product idea into a constrained, prototype-ready physical product package.

It does not invent a whole physical product from nothing. It separates:

- fixed functional core
- variable external shell
- configuration parameters
- manufacturing mock
- validation workflow
- build package
- sourcing package
- first-build report

## Core rule

Do not let the user freely redesign the risky functional system.

Instead:

1. Lock the functional core.
2. Expose safe customization dimensions.
3. Generate a shell / enclosure / surface around the core.
4. Validate fit and printability.
5. Test the physical prototype.
6. Record a build report.
7. Iterate.

## Generic pipeline

```text
Idea Input
  ↓
Product Intent Parser
  ↓
Fixed Core Selection
  ↓
Variable Shell Configuration
  ↓
Visual Preview
  ↓
CAD Export
  ↓
Print Validation
  ↓
Physical Testing
  ↓
Build Package
  ↓
Sourcing Pack
  ↓
First Build Runbook
```

## DIY Lamp Builder as reference

Fixed core: ReadingCore-01
Variable shell: lamp head / exterior form / cultural style / color / engraving
CAD layer: OpenSCAD shell mock
Print layer: fit-test coupon, slicer profile, orientation guide
Physical test layer: lux grid, heat soak, glare review
Build layer: sourcing pack, build package, first-build report

## Output contract

A compiled physical product demo should include:

- product architecture
- configuration JSON
- visual preview
- CAD export
- validation rules
- test protocol
- purchase-ready BOM
- sourcing checklist
- first-build runbook
- iteration decision gate
