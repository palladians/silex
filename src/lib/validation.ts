import { z } from "zod";

export const PublicKeySchema = z.string();
export const PrivateKeySchema = z.string();
export const DerivationPathSchema = z.array(z.number());

const SIGNERS = {
	evm: 0,
	solana: 1,
	mina: 2,
} as const;

export const SignerSchema = z.nativeEnum(SIGNERS);

export const TransportableAccountSchema = z
	.object({
		address: PublicKeySchema,
		signer: SignerSchema,
		derivationPath: DerivationPathSchema,
	})
	.strict();

export const TransportableSignRequestSchema = z
	.object({
		payload: z.any(),
		derivationPath: DerivationPathSchema,
		signer: SignerSchema,
		type: z.number(),
		options: z.array(z.number()).optional(),
	})
	.strict();

export const TransportableSignatureSchema = z
	.object({
		signature: z.string(),
		publicKey: PublicKeySchema,
	})
	.strict();
