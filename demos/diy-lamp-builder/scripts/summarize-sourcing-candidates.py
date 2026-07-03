#!/usr/bin/env python3
import csv
from pathlib import Path
from collections import Counter

path = Path("demos/diy-lamp-builder/outputs/sourcing/real-component-candidates.csv")
rows = list(csv.DictReader(path.open(encoding="utf-8")))

by_category = Counter(row["category"] for row in rows)
print("IDB-6G sourcing candidates summary")
for category, count in sorted(by_category.items()):
    print(f"- {category}: {count}")

prices = []
for row in rows:
    try:
        prices.append(float(row["observed_price_usd"]))
    except Exception:
        pass

if prices:
    print(f"Observed candidate price range: ${min(prices):.2f}-${max(prices):.2f}")

print("Reminder: prices are research notes, not purchase guarantees.")
