import type { CommonSigner, PrivateKey, PublicKey } from "$lib/signers/_/types";

type MinaUnsignedTransaction = {
	readonly to: PublicKey;
	readonly from: PublicKey;
	readonly fee: string;
	readonly nonce: string;
	readonly memo?: string;
	readonly validUntil?: string;
	readonly amount?: string;
};

export type MinaSignerOptions = {};

export type MinaSigner = CommonSigner<MinaUnsignedTransaction> & {
	signFields: ({
		fields,
		childPrivateKey,
		options,
	}: {
		fields: string[];
		childPrivateKey: PrivateKey;
		options?: Record<string, string>;
	}) => Promise<string>;
};
