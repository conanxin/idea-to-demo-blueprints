# Prototype Iteration Decision

Use this after filling the first-build report.

## Decision gates

### Gate A — mechanical fit

Proceed only if:
- M3 holes fit
- diffuser slot works
- aluminum channel seats properly
- cable exit does not damage wire

If not, iterate CAD before full build.

### Gate B — power-on observation

Proceed only if:
- no smell
- no smoke
- no wire movement
- no uncomfortable heat in first 10 minutes

If not, reduce power or change thermal path.

### Gate C — reading performance

Proceed only if:
- reading zone reaches usable lux
- direct LED is not visible
- paper hotspot is acceptable
- hand/book shadow is acceptable

If not, adjust diffuser, angle, or shell visor.

## Outcome

- READY_FOR_SECOND_PROTOTYPE
- ITERATE_CAD
- ITERATE_BOM
- ITERATE_LIGHT_ENGINE
- STOP_AND_REDESIGN
