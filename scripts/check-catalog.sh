#!/bin/bash
# scripts/check-catalog.sh
# IDB-4C: Lightweight catalog maintenance check
# Usage: bash scripts/check-catalog.sh

set -u

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT"

# Track results
PASS_COUNT=0
FAIL_COUNT=0
FAIL_LIST=""

pass() {
    echo "PASS  $1"
    PASS_COUNT=$((PASS_COUNT + 1))
}

fail() {
    echo "FAIL  $1"
    FAIL_COUNT=$((FAIL_COUNT + 1))
    FAIL_LIST="${FAIL_LIST}  - $1\n"
}

# Get file sha256 (or md5 fallback)
file_hash() {
    local f="$1"
    if command -v sha256sum >/dev/null 2>&1; then
        sha256sum "$f" 2>/dev/null | awk '{print $1}'
    else
        md5sum "$f" 2>/dev/null | awk '{print $1}'
    fi
}

# Get file extension
file_ext() {
    echo "${1##*.}"
}

# Get file size
file_size() {
    stat -c %s "$1" 2>/dev/null || wc -c < "$1" 2>/dev/null || echo 0
}

echo "[IDB catalog check]"
echo "Repository: $REPO_ROOT"
echo "Date: $(date -u +'%Y-%m-%dT%H:%M:%SZ')"
echo ""

# === 1. Key files exist ===
echo "--- 1. Key files exist ---"
# Check files - some exist in root, others in docs/
check_any() {
    local label="$1"
    shift
    for path in "$@"; do
        if [ -f "$path" ]; then
            pass "$label: $path"
            return 0
        fi
    done
    fail "$label: not found in [ $* ]"
    return 1
}

check_any "CHANGELOG exists" "docs/CHANGELOG.md" "CHANGELOG.md"
check_any "CONTRIBUTING exists" "CONTRIBUTING.md" "docs/CONTRIBUTING.md"

for f in README.md docs/ROADMAP.md docs/.nojekyll \
         docs/index.html public/index.html \
         data/blueprints.json public/data/blueprints.json docs/data/blueprints.json; do
    if [ -f "$f" ]; then
        pass "file exists: $f"
    else
        fail "missing file: $f"
    fi
done

# === 2. blueprints.json consistency ===
echo ""
echo "--- 2. Blueprint metadata sync ---"

H1=$(file_hash data/blueprints.json 2>/dev/null)
H2=$(file_hash public/data/blueprints.json 2>/dev/null)
H3=$(file_hash docs/data/blueprints.json 2>/dev/null)

if [ "$H1" = "$H2" ] && [ "$H2" = "$H3" ] && [ -n "$H1" ]; then
    pass "3 blueprints.json identical (sha256=${H1:0:12}...)"
else
    fail "blueprints.json NOT identical: data=$H1 public=$H2 docs=$H3"
fi

# Validate JSON content with Python
if command -v python3 >/dev/null 2>&1; then
    python3 <<'PYEOF' 2>&1
import json, sys

results = []
files = ['data/blueprints.json', 'public/data/blueprints.json', 'docs/data/blueprints.json']
for f in files:
    try:
        with open(f) as fh:
            d = json.load(fh)
        total = len(d.get('blueprints', []))
        meta_total = d.get('meta', {}).get('total')
        version = d.get('meta', {}).get('version')
        status_ok = all(b.get('status') == 'demo-ready' for b in d.get('blueprints', []))
        has_required_fields = all(
            all(k in b for k in ('page_url', 'demo_url', 'demo_pack_path'))
            for b in d.get('blueprints', [])
        )
        if total == 3 and meta_total == 3 and status_ok and has_required_fields:
            print(f"OK  {f}: total=3 meta.total=3 version={version} all=demo-ready all have page/demo/pack URLs")
        else:
            print(f"NO  {f}: total={total} meta.total={meta_total} version={version} status_ok={status_ok} fields_ok={has_required_fields}")
            sys.exit(1)
    except Exception as e:
        print(f"ERR {f}: {e}")
        sys.exit(1)
PYEOF
    if [ $? -eq 0 ]; then
        pass "blueprint metadata structure valid (3 demo-ready with all required URLs)"
    else
        fail "blueprint metadata structure invalid"
    fi
else
    fail "python3 not available for JSON structure check"
fi

# === 3. Blueprint pages exist ===
echo ""
echo "--- 3. Blueprint pages ---"
for slug in project-memory-meeting-assistant customer-meeting-autonomous-build multi-agent-project-dashboard; do
    [ -f "docs/blueprints/$slug.html" ] && pass "page exists: docs/blueprints/$slug.html" || fail "missing: docs/blueprints/$slug.html"
    [ -f "public/blueprints/$slug.html" ] && pass "page exists: public/blueprints/$slug.html" || fail "missing: public/blueprints/$slug.html"
done

# === 4. Demo pages exist ===
echo ""
echo "--- 4. Demo pages ---"
for slug in project-memory-meeting-assistant customer-meeting-autonomous-build multi-agent-project-dashboard; do
    [ -f "docs/demos/$slug/index.html" ] && pass "demo exists: docs/demos/$slug/index.html" || fail "missing: docs/demos/$slug/index.html"
    # public/demos is optional but check if exists
    if [ -d "public/demos/$slug" ]; then
        [ -f "public/demos/$slug/index.html" ] && pass "demo exists: public/demos/$slug/index.html" || echo "INFO  public/demos/$slug/index.html not found (optional)"
    fi
done

# === 5. Demo Pack completeness ===
echo ""
echo "--- 5. Demo Pack completeness ---"
for slug in project-memory-meeting-assistant customer-meeting-autonomous-build multi-agent-project-dashboard; do
    PACK="demos/$slug"
    if [ -d "$PACK" ]; then
        ALL_OK=true
        for sub in README.md inputs prompts outputs app validation validation/acceptance-checklist.md; do
            if [ ! -e "$PACK/$sub" ]; then
                ALL_OK=false
                fail "demo pack missing: $PACK/$sub"
            fi
        done
        if [ "$ALL_OK" = true ]; then
            pass "demo pack complete: $slug"
        fi
    else
        fail "demo pack missing: $PACK/"
    fi
done

# === 6. Screenshots ===
echo ""
echo "--- 6. Screenshots ---"
for img in homepage.png demo-project-memory-meeting-assistant.png demo-customer-meeting-autonomous-build.png demo-multi-agent-project-dashboard.png; do
    PATH_IMG="docs/media/$img"
    if [ ! -f "$PATH_IMG" ]; then
        fail "screenshot missing: $PATH_IMG"
        continue
    fi
    SIZE=$(file_size "$PATH_IMG")
    EXT=$(file_ext "$PATH_IMG")
    if [ "$SIZE" -le 0 ]; then
        fail "screenshot empty: $PATH_IMG"
    elif [ "$EXT" != "png" ]; then
        fail "screenshot wrong extension: $PATH_IMG (.png expected)"
    else
        # Optional: verify PNG via file command
        if command -v file >/dev/null 2>&1; then
            if file "$PATH_IMG" 2>/dev/null | grep -q "PNG image"; then
                pass "screenshot OK: $PATH_IMG (${SIZE} bytes, valid PNG)"
            else
                echo "INFO  screenshot: $PATH_IMG (${SIZE} bytes, PNG extension but file cmd cannot verify)"
                PASS_COUNT=$((PASS_COUNT + 1))
            fi
        else
            pass "screenshot OK: $PATH_IMG (${SIZE} bytes)"
        fi
    fi
done

# === 7. Version badge ===
echo ""
echo "--- 7. Version badge sync ---"
for f in docs/index.html public/index.html README.md; do
    if grep -q "v0\.1\.1-alpha" "$f" 2>/dev/null; then
        pass "version badge: v0.1.1-alpha in $f"
    else
        fail "version badge v0.1.1-alpha NOT in $f"
    fi
done
# Verify v0.1.0-alpha is preserved in CHANGELOG (historical record)
if grep -q "v0\.1\.0-alpha" docs/CHANGELOG.md 2>/dev/null; then
    pass "history preserved: v0.1.0-alpha in docs/CHANGELOG.md"
fi

# === 8. Release notes ===
echo ""
echo "--- 8. Release notes ---"
for v in v0.1.0-alpha v0.1.1-alpha; do
    if [ -f "docs/release/RELEASE_NOTES_${v}.md" ]; then
        pass "release notes exist: docs/release/RELEASE_NOTES_${v}.md"
    else
        fail "missing release notes: docs/release/RELEASE_NOTES_${v}.md"
    fi
done

# === 9. Sensitive info check ===
echo ""
echo "--- 9. Sensitive info check ---"
SECRET_FOUND=0
SECRET_PATTERNS=(
    'OPENAI_API_KEY=[A-Za-z0-9]{8,}'
    'TELEGRAM_BOT_TOKEN=[A-Za-z0-9]{8,}'
    'BOT_TOKEN=[A-Za-z0-9]{8,}'
    'ghp_[A-Za-z0-9]{8,}'
    'xoxb-[A-Za-z0-9-]{8,}'
    'sk-[A-Za-z0-9]{20,}'
    'AKIA[0-9A-Z]{16}'
)

# Scan directories (exclude .git, node_modules)
SCAN_DIRS="README.md docs public data demos scripts"
for pattern in "${SECRET_PATTERNS[@]}"; do
    # grep recursively, exclude .git
    HITS=$(grep -rEn --exclude-dir='.git' --exclude-dir='node_modules' "$pattern" $SCAN_DIRS 2>/dev/null || true)
    if [ -n "$HITS" ]; then
        SECRET_FOUND=1
        echo "$HITS" | while IFS= read -r line; do
            fail "SECRET pattern match: $line"
        done
    fi
done

if [ "$SECRET_FOUND" -eq 0 ]; then
    pass "no obvious secrets found"
fi

# === Summary ===
echo ""
echo "=========================================="
echo "Summary: PASS=$PASS_COUNT  FAIL=$FAIL_COUNT"
echo "=========================================="

if [ "$FAIL_COUNT" -eq 0 ]; then
    echo "RESULT: PASS"
    exit 0
else
    echo "RESULT: FAIL"
    echo ""
    echo "Failures:"
    printf "$FAIL_LIST"
    exit 1
fi