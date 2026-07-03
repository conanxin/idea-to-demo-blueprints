# Compiler Readiness Checklist

A product idea is ready for compiler treatment if:

- There is a clear user scenario.
- A fixed functional core can be defined.
- The customizable shell can be separated from the core.
- The risky parts can remain locked.
- Safe customization parameters exist.
- CAD output can be limited to shell/enclosure.
- A simple validation test exists.
- A first-build report can capture iteration data.
- The product is not high-risk for first prototype.

Stop or redesign if:

- user customization affects voltage / battery / mains
- core has no safe purchased module
- shell affects heat without validation
- product touches food / children / medical use
- structural load or safety-critical function is central
