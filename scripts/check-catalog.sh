#!/bin/bash
# check-catalog.sh - 轻量级验证脚本
# 检查项目目录结构、数据同步、关键文件是否存在

set -e

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT"

echo "🔍 Idea-to-Demo Blueprints - Catalog Check"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

PASS=0
FAIL=0

check() {
    local name="$1"
    local condition="$2"
    if [ "$condition" = "true" ]; then
        echo "✅ $name"
        PASS=$((PASS + 1))
    else
        echo "❌ $name"
        FAIL=$((FAIL + 1))
    fi
}

# 1. 检查三个 blueprints.json 存在
echo "📋 数据文件检查"
check "data/blueprints.json 存在" \
    "$([ -f data/blueprints.json ] && echo true || echo false)"

check "public/data/blueprints.json 存在" \
    "$([ -f public/data/blueprints.json ] && echo true || echo false)"

check "docs/data/blueprints.json 存在" \
    "$([ -f docs/data/blueprints.json ] && echo true || echo false)"

# 2. 检查三个 blueprints.json 内容一致
echo ""
echo "🔄 数据一致性"
MD5_1=$(md5sum data/blueprints.json 2>/dev/null | awk '{print $1}')
MD5_2=$(md5sum public/data/blueprints.json 2>/dev/null | awk '{print $1}')
MD5_3=$(md5sum docs/data/blueprints.json 2>/dev/null | awk '{print $1}')

check "三个 blueprints.json MD5 一致" \
    "$([ "$MD5_1" = "$MD5_2" ] && [ "$MD5_2" = "$MD5_3" ] && echo true || echo false)"

echo "   data/ MD5:       $MD5_1"
echo "   public/data/ MD5:$MD5_2"
echo "   docs/data/ MD5:  $MD5_3"

# 3. 检查 JSON 合法
echo ""
echo "✅ JSON 合法性"
for f in data/blueprints.json public/data/blueprints.json docs/data/blueprints.json \
         demos/multi-agent-project-dashboard/app/data.json \
         docs/demos/multi-agent-project-dashboard/data.json; do
    if [ -f "$f" ]; then
        if python3 -c "import json; json.load(open('$f'))" 2>/dev/null; then
            check "$f 合法" "true"
        else
            check "$f 合法" "false"
        fi
    fi
done

# 4. 检查 docs/.nojekyll 存在
echo ""
echo "📂 关键文件"
check "docs/.nojekyll 存在" \
    "$([ -f docs/.nojekyll ] && echo true || echo false)"

# 5. 检查关键页面文件存在
check "docs/index.html 存在" \
    "$([ -f docs/index.html ] && echo true || echo false)"

check "public/index.html 存在" \
    "$([ -f public/index.html ] && echo true || echo false)"

check "README.md 存在" \
    "$([ -f README.md ] && echo true || echo false)"

check "docs/ROADMAP.md 存在" \
    "$([ -f docs/ROADMAP.md ] && echo true || echo false)"

check "docs/CONTRIBUTING.md 存在" \
    "$([ -f docs/CONTRIBUTING.md ] && echo true || echo false)"

check "docs/CHANGELOG.md 存在" \
    "$([ -f docs/CHANGELOG.md ] && echo true || echo false)"

check "docs/release/RELEASE_NOTES_v0.1.0-alpha.md 存在" \
    "$([ -f docs/release/RELEASE_NOTES_v0.1.0-alpha.md ] && echo true || echo false)"

check "docs/media/README.md 存在" \
    "$([ -f docs/media/README.md ] && echo true || echo false)"

# 6. 检查三个 Blueprint 页面存在
echo ""
echo "📚 Blueprint 页面"
for slug in project-memory-meeting-assistant customer-meeting-autonomous-build multi-agent-project-dashboard; do
    check "docs/blueprints/$slug.html 存在" \
        "$([ -f "docs/blueprints/$slug.html" ] && echo true || echo false)"
done

# 7. 检查三个 Demo 目录存在
echo ""
echo "🎬 Demo 目录"
for slug in project-memory-meeting-assistant customer-meeting-autonomous-build multi-agent-project-dashboard; do
    check "docs/demos/$slug/index.html 存在" \
        "$([ -f "docs/demos/$slug/index.html" ] && echo true || echo false)"
done

# 8. 总结
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 结果：✅ $PASS 通过 / ❌ $FAIL 失败"
echo ""

if [ $FAIL -eq 0 ]; then
    echo "🎉 全部通过！项目结构完整。"
    exit 0
else
    echo "⚠️  有 $FAIL 项需要检查。"
    exit 1
fi