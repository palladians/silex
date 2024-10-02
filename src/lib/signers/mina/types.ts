import type { CommonSignArgs, CommonSigner } from "$lib/signers/_/types";
import type { PublicKey } from "$lib/types";

export type MinaUnsignedTransaction = {
	readonly to: PublicKey;
	readonly from: PublicKey;
	readonly fee: string;
	readonly nonce: string;
	readonly memo?: string;
	readonly validUntil?: string;
	readonly amount?: string;
};

export type MinaSignerOptions = Record<string, unknown>;

export type SignPayload =
	| {
			type: 1;
			payload: MinaUnsignedTransaction;
	  }
	| { type: 0; payload: string }
	| { type: 2; payload: string[] };

export type MinaSignArgs = CommonSignArgs & {
	network: 0 | 1; // mainnet, testnet;
} & SignPayload;

export type MinaSigner = CommonSigner<MinaSignArgs>;
