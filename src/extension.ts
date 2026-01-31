import * as crypto from 'node:crypto';
import * as vscode from 'vscode';
import { argon2id, bcryptHash, hmacSha256, initHash, sha256, sha512 } from './hash';

export function activate(context: vscode.ExtensionContext) {
	const disposable = vscode.commands.registerCommand('hashGenerator.generate', async () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) return;

		const selection = editor.selection;
		let text = editor.document.getText(selection);
		if (!text) text = editor.document.lineAt(selection.active.line).text;

		const choice = await vscode.window.showQuickPick([
			'SHA-256',
			'SHA-512',
			'HMAC-SHA256',
			'bcrypt (Go WASM)',
			'Argon2id (Go WASM)'
		], { placeHolder: 'Choose hash algorithm' });
		if (!choice) return;

		try {
			let out = '';
			if (choice === 'SHA-256') {
				out = sha256(text);
			} else if (choice === 'SHA-512') {
				out = sha512(text);
			} else if (choice === 'HMAC-SHA256') {
				const key = await vscode.window.showInputBox({ prompt: 'HMAC key' });
				if (key === undefined) return;
				out = hmacSha256(key, text);
			} else if (choice === 'bcrypt (Go WASM)') {
				const costStr = await vscode.window.showInputBox({ prompt: 'bcrypt cost (default 10)', value: '10' });
				if (costStr === undefined) return;
				const cost = parseInt(costStr, 10) || 10;
				await initHash(context.extensionPath);
				out = await bcryptHash(text, cost);
			} else if (choice === 'Argon2id (Go WASM)') {
				const timeStr = await vscode.window.showInputBox({ prompt: 'timeCost (iterations)', value: '3' });
				if (timeStr === undefined) return;
				const memStr = await vscode.window.showInputBox({ prompt: 'memoryCost (KB)', value: '65536' });
				if (memStr === undefined) return;
				const parStr = await vscode.window.showInputBox({ prompt: 'parallelism', value: '1' });
				if (parStr === undefined) return;
				const keyLenStr = await vscode.window.showInputBox({ prompt: 'keyLen (bytes)', value: '32' });
				if (keyLenStr === undefined) return;
				const saltB64 = await vscode.window.showInputBox({ prompt: 'salt (Base64) - leave empty to auto-generate' });
				const timeCost = parseInt(timeStr, 10) || 3;
				const memoryCost = parseInt(memStr, 10) || 65536;
				const parallelism = parseInt(parStr, 10) || 1;
				const keyLen = parseInt(keyLenStr, 10) || 32;

				let salt = saltB64;
				if (!salt) salt = crypto.randomBytes(16).toString('base64');

				await initHash(context.extensionPath);
				out = await argon2id(text, salt, timeCost, memoryCost, parallelism, keyLen);
			}

			if (out) {
				await editor.edit(editBuilder => {
					if (editor.selection && !editor.selection.isEmpty) {
						editBuilder.replace(editor.selection, out);
					} else {
						editBuilder.insert(editor.selection.active, out);
					}
				});
			}
		} catch (err) {
			vscode.window.showErrorMessage('Hash generation failed: ' + String(err));
		}
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
