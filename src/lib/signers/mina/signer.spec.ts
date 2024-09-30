import { it, expect } from "bun:test";
import { createSigner } from "./signer";

const rootPrivateKey =
  "59eabf9e91adfc40f7529e619fd9a7b47d41621715c27ce699da9a3a741536f377c405e496c91361ff3d65de1bb60f52c0add214d186ea0721151bee914e55fb";
const testPrivateKey = "EKEKBJEKE4HkjsZNpdq6mAg7Ekppa84F8hzPJxKaaGGtVUcuYpt5";

it("derives a child private key", async () => {
  const signer = createSigner();
  const childPrivateKey = await signer.deriveChildPrivateKey({
    rootPrivateKey,
    derivationPath: "m/44'/12586'/0'/0/0",
  });
  expect(childPrivateKey).toEqual(testPrivateKey);
});

it("signs a message", async () => {
  const signer = createSigner();
  const message = "Bonjour";
  const signedMessage = await signer.signMessage({
    message,
    childPrivateKey: testPrivateKey,
    options: { minaNetwork: "mainnet" },
  });
  expect(signedMessage).toEqual(
    "7mXLNa1vVrj9EXWhMqvE4k15XJ9ibp4DTLPYc5GvrdcwKYk2j5d83qGLy75Wp8a3NHeahos2d7oejBmrAGMuf8FKmKernmcr",
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
  const signedTransaction = await signer.signTransaction({
    unsignedTransaction: transaction,
    childPrivateKey: testPrivateKey,
    options: { minaNetwork: "mainnet" },
  });
  expect(signedTransaction).toEqual(
    "7mXNb9QUAvMZn6aLzDYQPk75jpvhseXV1mFFLVa6P2FvdZb6JYwkDnBfn5kAB1mNQjTcUBT4b6KZ3Xg8fYUyacEJYTn4ATmB",
  );
});

it("signs fields", async () => {
  const signer = createSigner();
  const fields = ["1", "2", "3"];
  const signedFields = await signer.signFields({
    fields,
    childPrivateKey: testPrivateKey,
    options: { minaNetwork: "mainnet" },
  });
  expect(signedFields).toEqual(
    "7mXCUvhLhFvG9ptrdfNceCrpThkCUyg1ct2z8uwY7eQbKz7UNmhv33TbuDjTznaypJtXRiMJyQWDnf27TH1FSXG7uJHTKAd9",
  );
});
