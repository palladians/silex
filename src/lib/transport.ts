import { base64 } from "@scure/base";
import { encode, decode } from "@msgpack/msgpack";
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

const _compressAndBase = (data: object): string => {
  const packed = encode(data);
  return base64.encode(packed);
};

const _debaseAndDecompress = (encoded: string): Record<string, unknown> => {
  const debased = base64.decode(encoded);
  return decode(debased) as Record<string, unknown>;
};

export const getTransportableAccount = (account: object) => {
  return _compressAndBase(TransportableAccountSchema.parse(account));
};

export const getAccountFromTransportable = (
  encoded: string,
): TransportableAccount => {
  const accountPayload = _debaseAndDecompress(encoded);
  return TransportableAccountSchema.parse({
    address: accountPayload.address,
    derivationPath: accountPayload.derivationPath,
    signer: accountPayload.signer,
  });
};

export const signRequestToTransportable = (payload: object) => {
  return _compressAndBase(TransportableSignRequestSchema.parse(payload));
};

export const transportableToSignRequest = (
  encoded: string,
): TransportableSignRequest => {
  const signRequest = _debaseAndDecompress(encoded);
  return TransportableSignRequestSchema.parse(signRequest);
};

export const signatureToTransportable = (payload: object) => {
  return _compressAndBase(TransportableSignatureSchema.parse(payload));
};

export const transportableToSignature = (
  encoded: string,
): TransportableSignature => {
  return TransportableSignatureSchema.parse(_debaseAndDecompress(encoded));
};
