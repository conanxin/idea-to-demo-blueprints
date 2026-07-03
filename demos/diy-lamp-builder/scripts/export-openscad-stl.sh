#!/usr/bin/env bash
# export-openscad-stl.sh
# IDB-6C CAD Export Demo Pack
# 可选脚本：如果系统安装了 OpenSCAD CLI，则导出 STL；否则输出 SKIP。

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CAD_DIR="$(cd "${SCRIPT_DIR}/../outputs/cad" && pwd)"
STL_DIR="${CAD_DIR}/stl"
CONFIG_FILE="${CAD_DIR}/sample-config.json"

if ! command -v openscad &>/dev/null; then
    echo "SKIP: OpenSCAD CLI not found. Install it to export STL:"
    echo "  Ubuntu/Debian: sudo apt install openscad"
    echo "  macOS:         brew install openscad"
    echo "  Windows:       https://openscad.org/downloads.html"
    exit 0
fi

mkdir -p "${STL_DIR}"

echo "INFO: OpenSCAD found at $(command -v openscad)"
echo "INFO: Using config: ${CONFIG_FILE}"

# Export ReadingCore-01 keepout STL
echo "EXPORT: readingcore-01-keepout.stl"
openscad -o "${STL_DIR}/readingcore-01-keepout.stl" "${CAD_DIR}/readingcore-01-keepout.scad"

# Export sample Hutong Window shell STL using parameters from JSON.
# For portability, we read the parameters via a simple Python-free jq/awk-free approach.
# If jq is available, use it; otherwise fall back to grep/sed to parse the JSON.
extract_param() {
    local key="$1"
    local val
    if command -v jq &>/dev/null; then
        val=$(jq -r ".sample_shell.parameters.${key} // empty" "${CONFIG_FILE}")
    else
        # Fallback: extract "key": value from JSON line, ignoring whitespace.
        val=$(grep -oP "\"${key}\"\s*:\s*\K[0-9.]+" "${CONFIG_FILE}" | head -n1)
    fi
    echo "${val}"
}

SHELL_LENGTH=$(extract_param shell_length)
SHELL_WIDTH=$(extract_param shell_width)
SHELL_HEIGHT=$(extract_param shell_height)
WALL_THICKNESS=$(extract_param wall_thickness)
WINDOW_COUNT=$(extract_param window_count)
CUTOUT_RATIO=$(extract_param cutout_ratio)

# Validate that we got numeric values for all required parameters.
for var in SHELL_LENGTH SHELL_WIDTH SHELL_HEIGHT WALL_THICKNESS WINDOW_COUNT CUTOUT_RATIO; do
    if [[ -z "${!var}" ]]; then
        echo "ERROR: Could not read ${var} from ${CONFIG_FILE}" >&2
        exit 1
    fi
done

echo "EXPORT: sample-hutong-window-shell.stl"
openscad \
    -D "shell_length=${SHELL_LENGTH}" \
    -D "shell_width=${SHELL_WIDTH}" \
    -D "shell_height=${SHELL_HEIGHT}" \
    -D "wall_thickness=${WALL_THICKNESS}" \
    -D "window_count=${WINDOW_COUNT}" \
    -D "cutout_ratio=${CUTOUT_RATIO}" \
    -o "${STL_DIR}/sample-hutong-window-shell.stl" \
    "${CAD_DIR}/sample-hutong-window-shell.scad"

echo "DONE: STL files exported to ${STL_DIR}/"
ls -la "${STL_DIR}/"
