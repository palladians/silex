import type { DerivationPath, PrivateKey, PublicKey } from "$lib/types";

export type CommonSignArgs = {
	childPrivateKey: PrivateKey;
	type: number;
};

type Sign<T extends CommonSignArgs> = (args: T) => Promise<string>;

export type CommonSigner<T extends CommonSignArgs> = {
	name: string;
	slug: string;
	getPublicKey: (args: { privateKey: PrivateKey }) => Promise<PublicKey>;
	deriveChildPrivateKey: (args: {
		rootPrivateKey: PrivateKey;
		derivationPath: DerivationPath;
	}) => Promise<string>;
	sign: Sign<T>;
};
