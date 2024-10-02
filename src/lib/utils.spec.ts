import { expect, it } from "bun:test";
import { arrayToPath, pathToArray } from "./utils";

const PATH = "m/44'/12586'/0'/0/0";
const PATH_ARRAY = [2147483692, 2147496234, 2147483648, 0, 0];

it("converts derivation path", async () => {
	const result = pathToArray(PATH);
	expect(result).toEqual(PATH_ARRAY);
});

it("converts derivation array to string", async () => {
	const result = arrayToPath(PATH_ARRAY);
	expect(result).toEqual(PATH);
});
