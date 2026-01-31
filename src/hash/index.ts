import * as crypto from 'node:crypto';
import { argon2id, bcryptHash, initHash } from './wasm-hash';

export function sha256(input: string): string {
	return crypto.createHash('sha256').update(input).digest('hex');
}

export function sha512(input: string): string {
	return crypto.createHash('sha512').update(input).digest('hex');
}

export function hmacSha256(key: string, input: string): string {
	return crypto.createHmac('sha256', key).update(input).digest('hex');
}

export { argon2id, bcryptHash, initHash };
