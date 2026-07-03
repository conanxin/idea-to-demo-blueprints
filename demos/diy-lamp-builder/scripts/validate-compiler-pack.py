#!/usr/bin/env python3
from pathlib import Path
import json
import sys

base = Path("demos/diy-lamp-builder/outputs/compiler")
required = [
    "README.md",
    "idea-to-physical-product-compiler.md",
    "compiler-schema.json",
    "fixed-core-vs-variable-shell-pattern.md",
    "product-type-adaptation-matrix.md",
    "demo-to-build-pipeline.md",
    "reusable-agent-prompt.md",
    "next-product-candidates.md",
    "compiler-readiness-checklist.md",
    "sample-compiled-product.json",
]

missing = [f for f in required if not (base / f).exists()]
if missing:
    print("MISSING compiler files:", missing)
    sys.exit(1)

schema = json.loads((base / "compiler-schema.json").read_text(encoding="utf-8"))
assert schema["phase"] == "IDB-6I"
assert "pipeline" in schema
for step in ["idea_input", "fixed_core_selection", "cad_export", "physical_testing", "first_build_runbook"]:
    assert step in schema["pipeline"], step

sample = json.loads((base / "sample-compiled-product.json").read_text(encoding="utf-8"))
assert sample["phase"] == "IDB-6I"
assert sample["compiled_product"]["fixed_core"]["locked"] is True

pattern = (base / "fixed-core-vs-variable-shell-pattern.md").read_text(encoding="utf-8")
for needle in ["Fixed Core", "Variable Shell", "ReadingCore-01"]:
    assert needle in pattern, needle

print("IDB-6I compiler pack validation: PASS")
