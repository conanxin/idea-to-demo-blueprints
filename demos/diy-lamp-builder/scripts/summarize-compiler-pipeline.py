#!/usr/bin/env python3
import json
from pathlib import Path

schema = json.loads(Path("demos/diy-lamp-builder/outputs/compiler/compiler-schema.json").read_text(encoding="utf-8"))
print("IDB-6I Idea-to-Physical-Product Compiler Pipeline")
for i, step in enumerate(schema["pipeline"], 1):
    print(f"{i}. {step}")
print("not_certification:", schema["not_certification"])
