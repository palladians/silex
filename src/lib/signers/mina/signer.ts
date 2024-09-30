import { HDKey, privateKeyToAccount } from "@mina-js/accounts";
import { sha256 } from "@noble/hashes/sha256";
import { bytesToHex } from "@noble/hashes/utils";
import { base58check } from "@scure/base";
import type { MinaSigner, MinaSignerOptions } from "./types";
import { legacySignatureConverter } from "./utils";

type HDKeyToAccountOptions = {
	hdKey: HDKey;
	path: string;
};

const _deriveChildPrivateKey = ({ hdKey, path }: HDKeyToAccountOptions) => {
	const childNode = hdKey.derive(path);
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
		signTransaction: async ({
			unsignedTransaction,
			childPrivateKey,
			options,
		}) => {
			const minaNetwork = options?.minaNetwork;
			if (!minaNetwork) throw new Error("Mina network not provided");
			const account = privateKeyToAccount({
				privateKey: childPrivateKey,
				network: minaNetwork as "mainnet" | "testnet",
			});
			const signedTransaction = await account.signTransaction({
				transaction: unsignedTransaction,
			});
			return legacySignatureConverter(signedTransaction.signature).toBase58();
		},
		signMessage: async ({ message, childPrivateKey, options }) => {
			const minaNetwork = options?.minaNetwork;
			if (!minaNetwork) throw new Error("Mina network not provided");
			const account = privateKeyToAccount({
				privateKey: childPrivateKey,
				network: minaNetwork as "mainnet" | "testnet",
			});
			const signedMessage = await account.signMessage({ message });
			return legacySignatureConverter(signedMessage.signature).toBase58();
		},
		signFields: async ({ fields, childPrivateKey, options }) => {
			const minaNetwork = options?.minaNetwork;
			if (!minaNetwork) throw new Error("Mina network not provided");
			const account = privateKeyToAccount({
				privateKey: childPrivateKey,
				network: minaNetwork as "mainnet" | "testnet",
			});
			const bigIntFields = fields.map((field) => BigInt(field));
			const signedFields = await account.signFields({ fields: bigIntFields });
			return signedFields.signature;
		},
	};
};
