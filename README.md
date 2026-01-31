# Hash Generator VSCode Extension

This VSCode extension allows you to generate various hash values directly within the editor.

## Features

- Generate SHA-256 hashes
- Generate SHA-512 hashes
- Generate HMAC-SHA256 hashes
- Generate bcrypt hashes (using Go WASM)
- Generate Argon2id hashes (using Go WASM)

## Usage

1. Select text in the editor (or leave it empty to hash the entire line)
2. Run the "Generate Hash" command via:
   - Command Palette (Ctrl+Shift+P): "Generate Hash"
   - Right-click context menu: "Generate Hash"
3. Choose the hash algorithm you want to use
4. For bcrypt and Argon2id, you'll be prompted for additional parameters
5. The result will be inserted at the cursor position or replace the selected text

## Requirements

- VSCode 1.108.1 or higher

## Build Instructions

### Prerequisites

- Go toolchain (>=1.25.6) installed and available in PATH.
- Node.js and npm (for extension development).
- The `out/hash/` directory will be created automatically.

### Building the WASM modules

#### Linux/macOS

```sh
cd ./src-wasm && ./build.sh
```

#### Windows (PowerShell)

```powershell
cd .\src-wasm && .\build.bat
```

These scripts compile `hash.wasm` into `out/hash/`.

### wasm_exec.js

The scripts also copy `wasm_exec.js` from the Go installation to `out/hash/` if it is not already present.

## Continuous Integration

The project includes a GitHub Actions workflow (`.github/workflows/ci.yml`) that runs on every push and pull request to the `main` branch. The workflow performs the following steps:

1. Checks out the repository.
2. Sets up Node.js (version 24).
3. Caches npm dependencies to speed up subsequent runs.
4. Installs npm dependencies with `npm ci`.
5. Ensures the WASM build script is executable and runs `src-wasm/build.sh` to compile the WebAssembly modules.
6. Packages the extension into a VSIX file using `vsce package`.
7. Uploads the generated VSIX as an artifact for download.

This CI ensures that the extension builds correctly on a clean Ubuntu environment and that the generated VSIX artifact is always available.

## Release Notes

### 0.1.0

Initial release of Hash Generator
