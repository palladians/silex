export type DerivationPath = string;
export type PublicKey = string;
export type PrivateKey = string;

export type CommonSigner<T> = {
	name: string;
	slug: string;
	getPublicKey: ({
		privateKey,
	}: {
		privateKey: PrivateKey;
	}) => Promise<PublicKey>;
	deriveChildPrivateKey: ({
		rootPrivateKey,
		derivationPath,
	}: {
		rootPrivateKey: PrivateKey;
		derivationPath: DerivationPath;
	}) => Promise<string>;
	signTransaction: ({
		unsignedTransaction,
		childPrivateKey,
		options,
	}: {
		unsignedTransaction: T;
		childPrivateKey: PrivateKey;
		options?: Record<string, string>;
	}) => Promise<string>;
	signMessage: ({
		message,
		childPrivateKey,
		options,
	}: {
		message: string;
		childPrivateKey: PrivateKey;
		options?: Record<string, string>;
	}) => Promise<string>;
};
