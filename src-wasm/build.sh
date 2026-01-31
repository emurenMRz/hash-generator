#!/bin/sh
set -e

REPOROOT=$(git rev-parse --show-toplevel)

# Build Go WASM modules. Requires Go toolchain.
MODULES="hash"

for name in $MODULES; do
  echo "Building ${name}.wasm..."
  GOOS=js GOARCH=wasm go build -o "${REPOROOT}/out/hash/${name}.wasm" -trimpath .
done

# Copy wasm_exec.js from Go installation if not already present
if [ ! -f wasm_exec.js ]; then
  echo "Copying wasm_exec.js from Go installation..."
  cp "$(go env GOROOT)/lib/wasm/wasm_exec.js" "${REPOROOT}/out/hash/"
fi

echo "Done. All WASM modules built successfully."
