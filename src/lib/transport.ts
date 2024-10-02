import { base64, bytesToString, stringToBytes } from "@scure/base";
import { compress, decompress } from "lzw-compressor";
import type {
	TransportableAccount,
	TransportableSignRequest,
	TransportableSignature,
} from "./types";
import {
	TransportableAccountSchema,
	TransportableSignRequestSchema,
	TransportableSignatureSchema,
} from "./validation";

const _base64AndCompress = (data: object) => {
	const compressed = compress(JSON.stringify(data));
	return base64.encode(stringToBytes("utf8", compressed));
};

const _decompressAndDebase64 = (encoded: string) => {
	const encodedString = bytesToString("utf8", base64.decode(encoded));
	return JSON.parse(decompress(encodedString));
};

export const getTransportableAccount = (account: object) => {
	return _base64AndCompress(TransportableAccountSchema.parse(account));
};

export const getAccountFromTransportable = (
	encoded: string,
): TransportableAccount => {
	const accountPayload = _decompressAndDebase64(encoded);
	return TransportableAccountSchema.parse({
		address: accountPayload.address,
		derivationPath: accountPayload.derivationPath,
		signer: accountPayload.signer,
	});
};

export const signRequestToTransportable = (payload: object) => {
	return _base64AndCompress(TransportableSignRequestSchema.parse(payload));
};

export const transportableToSignRequest = (
	encoded: string,
): TransportableSignRequest => {
	const signRequest = _decompressAndDebase64(encoded);
	return TransportableSignRequestSchema.parse(signRequest);
};

export const signatureToTransportable = (payload: object) => {
	return _base64AndCompress(TransportableSignatureSchema.parse(payload));
};

export const transportableToSignature = (
	encoded: string,
): TransportableSignature => {
	return TransportableSignatureSchema.parse(_decompressAndDebase64(encoded));
};
