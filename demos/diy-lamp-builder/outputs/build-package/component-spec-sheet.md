# Component Specification Sheet

## ReadingCore-01 fixed assumptions

- 24V linear LED cassette
- LED strip mounted to aluminum channel
- Opal diffuser in front of LED strip
- Custom shell does not carry electrical load
- Shell must preserve keepout, diffuser slot, M3 holes, and cable exit

## Component specs

### 24V LED strip

Minimum:
- 24V DC
- warm white
- CRI90+
- suitable for short segment around 220-260mm

Recommended:
- COB or dense LED strip
- CRI95 if available
- 3000K for warm reading; 4000K for focused desk work

Avoid:
- unknown voltage strips
- very cold 6500K-only strips
- low-CRI decorative strips
- strips requiring mains voltage

### Aluminum channel + diffuser

Minimum:
- compatible with strip width
- opal or milky diffuser
- long enough for the lamp head

Recommended:
- 240-260mm channel
- snap-on diffuser
- flat mounting back

Avoid:
- plastic-only channel for reading-power prototype
- clear diffuser that exposes LED dots

### Power adapter

Minimum:
- 24V DC
- enough current for selected strip and dimmer

Recommended:
- 24V 1A-2A
- known safety marks
- stable connector

Avoid:
- direct mains wiring
- no-name adapters with unclear rating

### Dimmer/controller

Minimum:
- supports selected voltage and current

Recommended:
- inline PWM dimmer or touch dimmer
- easy to mount outside hot zone

Avoid:
- flickery dimmers
- controllers that require app/cloud dependency for basic use
