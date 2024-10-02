import type { z } from "zod";
import type {
	DerivationPathSchema,
	PrivateKeySchema,
	PublicKeySchema,
	SignerSchema,
	TransportableAccountSchema,
	TransportableSignRequestSchema,
	TransportableSignatureSchema,
} from "./validation";

// Primitives
export type PublicKey = z.infer<typeof PublicKeySchema>;
export type PrivateKey = z.infer<typeof PrivateKeySchema>;
export type DerivationPath = z.infer<typeof DerivationPathSchema>;
export type Signer = z.infer<typeof SignerSchema>;

// Transport Layer
export type TransportableAccount = z.infer<typeof TransportableAccountSchema>;
export type TransportableSignRequest = z.infer<
	typeof TransportableSignRequestSchema
>;
export type TransportableSignature = z.infer<
	typeof TransportableSignatureSchema
>;
