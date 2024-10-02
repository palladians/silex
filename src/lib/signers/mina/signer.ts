import { arrayToPath } from "$lib/utils";
import { HDKey, privateKeyToAccount } from "@mina-js/accounts";
import { sha256 } from "@noble/hashes/sha256";
import { bytesToHex } from "@noble/hashes/utils";
import { base58check } from "@scure/base";
import { match } from "ts-pattern";
import type { MinaSigner, MinaSignerOptions } from "./types";
import { legacySignatureConverter } from "./utils";

type HDKeyToAccountOptions = {
	hdKey: HDKey;
	path: number[];
};

const _deriveChildPrivateKey = ({ hdKey, path }: HDKeyToAccountOptions) => {
	const childNode = hdKey.derive(arrayToPath(path));
	if (!childNode.privateKey) throw new Error("Private key not found");
	const childPrivateKeyArray = new Uint8Array(childNode.privateKey);
	childPrivateKeyArray[0] &= 0x3f;
	const childPrivateKey = childPrivateKeyArray.reverse();
	const privateKeyHex = `5a01${bytesToHex(childPrivateKey)}`;
	if (!privateKeyHex) throw new Error("Private key is empty");
	if (!privateKeyHex.match(/.{1,2}/g))
		throw new Error("Failed to split privateKeyHex into bytes");
	const privateKeyBytes = new Uint8Array(
		privateKeyHex.match(/.{1,2}/g)?.map((byte) => Number.parseInt(byte, 16)) ||
			[],
	);
	return base58check(sha256).encode(privateKeyBytes);
};

export const createSigner = (_: MinaSignerOptions = {}): MinaSigner => {
	return {
		name: "Mina Protocol",
		slug: "mina",
		getPublicKey: async ({ privateKey }) => {
			const account = privateKeyToAccount({ privateKey, network: "mainnet" });
			return account.publicKey;
		},
		deriveChildPrivateKey: async ({ rootPrivateKey, derivationPath }) => {
			const hdKey = HDKey.fromExtendedKey(rootPrivateKey);
			return _deriveChildPrivateKey({ hdKey, path: derivationPath });
		},
		sign: async (signaturePayload) => {
			const account = privateKeyToAccount({
				privateKey: signaturePayload.childPrivateKey,
				network: signaturePayload.network === 0 ? "mainnet" : "testnet",
			});
			return match(signaturePayload)
				.with({ type: 0 }, async ({ payload }) => {
					const { signature } = await account.signMessage({
						message: payload,
					});
					return legacySignatureConverter(signature).toBase58();
				})
				.with({ type: 1 }, async ({ payload }) => {
					const txBody = {
						...payload,
						amount: BigInt(payload.amount ?? ""),
						fee: BigInt(payload.fee ?? ""),
						nonce: BigInt(payload.nonce ?? ""),
					};
					const { signature } = await account.signTransaction({
						transaction: txBody,
					});
					return legacySignatureConverter(signature).toBase58();
				})
				.with({ type: 2 }, async ({ payload }) => {
					const fields = payload.map((field) => BigInt(field));
					const result = await account.signFields({ fields });
					return result.signature;
				})
				.exhaustive();
		},
	};
};
