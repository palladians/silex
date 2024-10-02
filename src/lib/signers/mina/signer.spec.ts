import { expect, it } from "bun:test";
import { pathToArray } from "$lib/utils";
import { createSigner } from "./signer";

const rootPrivateKey =
	"xprv9s21ZrQH143K2qibXtqGd39wAWC6cho6YL2poXyZC1ah44GGFESc2D779kstN93jzVN5Vf68usCQnHkPMcXfjNRfBp1HkDnjadcbrYwRptF";
const testPrivateKey = "EKEG5Dj44pUvRGwPZauMzYnneFWAyCn3qoJLCSwX2BnkJg4duYa4";

it("derives a child private key", async () => {
	const signer = createSigner();
	const childPrivateKey = await signer.deriveChildPrivateKey({
		rootPrivateKey,
		derivationPath: pathToArray("m/44'/12586'/0'/0/0"),
	});
	expect(childPrivateKey).toEqual(testPrivateKey);
});

it("signs a message", async () => {
	const signer = createSigner();
	const message = "Bonjour";
	const signedMessage = await signer.sign({
		type: 0,
		payload: message,
		childPrivateKey: testPrivateKey,
		network: 0,
	});
	expect(signedMessage).toEqual(
		"7mX2cx8F3bFr7Tcc4N9MfxdnV91PJW3NvyUVnt5JPJ2DfhAjZXsJbgD2FCQG1HdaEKjtuirJT6NhigqQhoqrdcFbc2sKmZ6M",
	);
});

it("signs a transaction", async () => {
	const signer = createSigner();
	const transaction = {
		nonce: "1",
		from: "B62qmWKtvNQTtUqo1LxfEEDLyWMg59cp6U7c4uDC7aqgaCEijSc3Hx5",
		to: "B62qmWKtvNQTtUqo1LxfEEDLyWMg59cp6U7c4uDC7aqgaCEijSc3Hx5",
		amount: "3000000000",
		fee: "100000000",
	};
	const signedTransaction = await signer.sign({
		type: 1,
		payload: transaction,
		childPrivateKey: testPrivateKey,
		network: 0,
	});
	expect(signedTransaction).toEqual(
		"7mX3cnNN6xZzRSYnmZtfpCXaiRfhmwdJALDXayM1HTvjTvnsBR4gQYNzreribztMvcBk4nu2YX2Cx2GM3hhPf3Z2g9toH8v5",
	);
});

it("signs fields", async () => {
	const signer = createSigner();
	const fields = ["1", "2", "3"];
	const signedFields = await signer.sign({
		type: 2,
		payload: fields,
		childPrivateKey: testPrivateKey,
		network: 0,
	});
	expect(signedFields).toEqual(
		"7mWxizVb37wnPwUKborEy513t8GAnX1d5nmna4vgECudYA6EfHBa8xhmYqJgzDDMVFQ2THZ121xrRXK9nuq7omXNfa8WatvY",
	);
});
