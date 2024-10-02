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
		"eyJhZGRyZXNzIjoiQjYycWtZYTFvNk1qNnVUVGpEUUNvYjdGWVpzcHVoa200UlJRaGdKZzlqNGtvRUJXaVNyVFFyUyIsInNpZ25lcsSJMsWEZMWKaXZhdGlvblDFk2jEiVsyMTQ3NDgzNjnFjcWdxZ80OcSNMzQsxafFoMWiNsWhLDDFtF19",
	);
});

it("decodes transport data", async () => {
	const mockData =
		"eyJhZGRyZXNzIjoiQjYycWtZYTFvNk1qNnVUVGpEUUNvYjdGWVpzcHVoa200UlJRaGdKZzlqNGtvRUJXaVNyVFFyUyIsInNpZ25lcsSJMsWEZMWKaXZhdGlvblDFk2jEiVsyMTQ3NDgzNjnFjcWdxZ80OcSNMzQsxafFoMWiNsWhLDDFtF19";
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
		"eyJwYXlsb2FkIjoiQm9uam91ciIsImRlcml2YXRpxI1QxJtoxIlbMjE0NzQ4MzY5MizEpMSmNDk2MjM0xK7EpcSnxKk2xKgsMMS9XcSUc2lnbsSXxInErSJ0eXBlxInEviJvcMScxI1zxKIwXX0=",
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
		"eyJwYXlsb2FkIjrEgGZyb23EiSJCNjJxa1lhMW82TWo2dVRUakRRQ29iN0ZZWnNwdWhrbTRSUlFoZ0pnOWo0a29FQldpU3JUUXJTIiwidG/EkMSSxJTElsSYxJrEnMSexKDEosSkxKbEqMSqxKzErsSwxLLEtMS2xLjEusS8xL7FgMWCxYTFhsWIxYpmZWXEkDEwxbHFsjDFiSJub25jxa46IjHFtWFtb3VudMWvxbPGh8W1bWXGgcSQSGVsxIUifcWKZGVyaXZhdGnFuFDGmmjEiVsyMTQ3NDgzNjkyLMajxqU0OcSTMzTGrcakxqbGqDbGpywwxrtdxYpzaWduxpbEicasxYt5cMW7McWKb3DGm8W4c8ahMF19",
	);
});

it("decodes sign request", () => {
	const tranportable =
		"eyJwYXlsb2FkIjoiQm9uam91ciIsImRlcml2YXRpxI1QxJtoxIlbMjE0NzQ4MzY5MizEpMSmNDk2MjM0xK7EpcSnxKk2xKgsMMS9XcSUc2lnbsSXxInErSJ0eXBlxInEviJvcMScxI1zxKIwXX0=";
	const signRequest = transportableToSignRequest(tranportable);
	expect(signRequest.payload).toEqual("Bonjour");
});

it("converts signature to transportable", () => {
	const transportable = signatureToTransportable({
		signature: "signature",
		publicKey: "publicKey",
	});
	expect(transportable).toEqual(
		"eyJzaWduYXR1cmUiOsSBxIPEhcSHxIkiLCJwdWJsaWNLZXnEi8SUxJbEmMSaxJwifQ==",
	);
});

it("decodes signature", () => {
	const transportable =
		"eyJzaWduYXR1cmUiOsSBxIPEhcSHxIkiLCJwdWJsaWNLZXnEi8SUxJbEmMSaxJwifQ==";
	const signature = transportableToSignature(transportable);
	expect(signature.signature).toEqual("signature");
});
