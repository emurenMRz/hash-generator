import * as fs from 'node:fs';
import * as path from 'node:path';

let _ready = false;

function waitForGlobal(name: string, timeout = 5000): Promise<void> {
	const start = Date.now();
	return new Promise((resolve, reject) => {
		const t = setInterval(() => {
			if ((global as any)[name]) {
				clearInterval(t);
				_ready = true;
				resolve();
			}
			if (Date.now() - start > timeout) {
				clearInterval(t);
				reject(new Error('timeout waiting for ' + name));
			}
		}, 50);
	});
}

export async function initHash(contextPath: string): Promise<void> {
	if (_ready) return;
	const execPath = path.join(contextPath, 'out', 'hash', 'wasm_exec.js');
	const wasmPath = path.join(contextPath, 'out', 'hash', 'hash.wasm');

	require(execPath);
	const Go = (global as any).Go;
	if (!Go) throw new Error('Go runtime not found (wasm_exec.js incorrect)');

	const go = new Go();
	const wasmBytes = fs.readFileSync(wasmPath);
	const mod = await WebAssembly.instantiate(wasmBytes, go.importObject);
	go.run(mod.instance);

	await waitForGlobal('argon2id');
	await waitForGlobal('bcryptHash');
}

export async function argon2id(
	password: string,
	saltBase64: string,
	timeCost: number,
	memoryCost: number,
	parallelism: number,
	keyLen: number
): Promise<string> {
	if (!(global as any).argon2id) throw new Error('argon2 not initialized');
	const res = (global as any).argon2id(password, saltBase64, timeCost, memoryCost, parallelism, keyLen);
	return String(res);
}

export async function bcryptHash(password: string, cost: number): Promise<string> {
	if (!(global as any).bcryptHash) throw new Error('bcrypt not initialized');
	const res = (global as any).bcryptHash(password, cost);
	return String(res);
}
