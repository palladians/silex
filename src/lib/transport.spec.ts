import { expect, it } from "bun:test";
import type { MinaUnsignedTransaction } from "./signers/mina";
import {
  getAccountFromTransportable,
  getTransportableAccount,
  signRequestToTransportable,
  signatureToTransportable,
  transportableToSignRequest,
  transportableToSignature,
} from "./transport";
import { pathToArray } from "./utils";

const testAccount = {
  address: "B62qkYa1o6Mj6uTTjDQCob7FYZspuhkm4RRQhgJg9j4koEBWiSrTQrS",
  derivationPath: pathToArray("m/44'/12586'/0'/0/0"),
  signer: 2,
};

it("creates decodeable transport data", async () => {
  const encoded = getTransportableAccount(testAccount);
  expect(encoded).toEqual(
    "g6dhZGRyZXNz2TdCNjJxa1lhMW82TWo2dVRUakRRQ29iN0ZZWnNwdWhrbTRSUlFoZ0pnOWo0a29FQldpU3JUUXJTpnNpZ25lcgKuZGVyaXZhdGlvblBhdGiVzoAAACzOgAAxKs6AAAAAAAA=",
  );
});

it("decodes transport data", async () => {
  const mockData =
    "g6dhZGRyZXNz2TdCNjJxa1lhMW82TWo2dVRUakRRQ29iN0ZZWnNwdWhrbTRSUlFoZ0pnOWo0a29FQldpU3JUUXJTpnNpZ25lcgKuZGVyaXZhdGlvblBhdGiVzoAAACzOgAAxKs6AAAAAAAA=";
  const account = getAccountFromTransportable(mockData);
  expect(account.address).toEqual(testAccount.address);
});

it("converts sign request to transportable", () => {
  const signRequest = {
    payload: "Bonjour",
    derivationPath: pathToArray("m/44'/12586'/0'/0/0"),
    signer: 2,
    type: 0,
    options: [0],
  };
  const result = signRequestToTransportable(signRequest);
  expect(result).toEqual(
    "hadwYXlsb2Fkp0JvbmpvdXKuZGVyaXZhdGlvblBhdGiVzoAAACzOgAAxKs6AAAAAAACmc2lnbmVyAqR0eXBlAKdvcHRpb25zkQA=",
  );
});

it("converts sign request to transportable for transaction", () => {
  const txPayload: MinaUnsignedTransaction = {
    from: "B62qkYa1o6Mj6uTTjDQCob7FYZspuhkm4RRQhgJg9j4koEBWiSrTQrS",
    to: "B62qkYa1o6Mj6uTTjDQCob7FYZspuhkm4RRQhgJg9j4koEBWiSrTQrS",
    fee: "10000000",
    nonce: "1",
    amount: "1000000000",
    memo: "Hello",
  };
  const signRequest = {
    payload: txPayload,
    derivationPath: pathToArray("m/44'/12586'/0'/0/0"),
    signer: 2,
    type: 1,
    options: [0],
  };
  const result = signRequestToTransportable(signRequest);
  expect(result).toEqual(
    "hadwYXlsb2FkhqRmcm9t2TdCNjJxa1lhMW82TWo2dVRUakRRQ29iN0ZZWnNwdWhrbTRSUlFoZ0pnOWo0a29FQldpU3JUUXJTonRv2TdCNjJxa1lhMW82TWo2dVRUakRRQ29iN0ZZWnNwdWhrbTRSUlFoZ0pnOWo0a29FQldpU3JUUXJTo2ZlZagxMDAwMDAwMKVub25jZaExpmFtb3VudKoxMDAwMDAwMDAwpG1lbW+lSGVsbG+uZGVyaXZhdGlvblBhdGiVzoAAACzOgAAxKs6AAAAAAACmc2lnbmVyAqR0eXBlAadvcHRpb25zkQA=",
  );
});

it("decodes sign request", () => {
  const tranportable =
    "hadwYXlsb2Fkp0JvbmpvdXKuZGVyaXZhdGlvblBhdGiVzoAAACzOgAAxKs6AAAAAAACmc2lnbmVyAqR0eXBlAKdvcHRpb25zkQA=";
  const signRequest = transportableToSignRequest(tranportable);
  expect(signRequest.payload).toEqual("Bonjour");
});

it("converts signature to transportable", () => {
  const transportable = signatureToTransportable({
    signature: "signature",
    publicKey: "publicKey",
  });
  expect(transportable).toEqual(
    "gqlzaWduYXR1cmWpc2lnbmF0dXJlqXB1YmxpY0tlealwdWJsaWNLZXk=",
  );
});

it("decodes signature", () => {
  const transportable =
    "gqlzaWduYXR1cmWpc2lnbmF0dXJlqXB1YmxpY0tlealwdWJsaWNLZXk=";
  const signature = transportableToSignature(transportable);
  expect(signature.signature).toEqual("signature");
});
