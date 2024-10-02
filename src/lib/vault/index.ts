import * as MinaSigner from "$lib/signers/mina";
import type { DerivationPath, Signer } from "$lib/types";
import { HDKey } from "@scure/bip32";
import { generateMnemonic, mnemonicToSeedSync } from "@scure/bip39";
import { wordlist } from "@scure/bip39/wordlists/english";
import { nanoid } from "nanoid";
import { readable } from "svelte/store";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createStore } from "zustand/vanilla";

export type Account = {
	id: string;
	address: string;
	derivationPath: DerivationPath;
	signer: Signer;
	seedId: string;
};

export type VaultData = {
	accounts: Account[];
};

export type VaultActions = {
	// Account actions
	addAccount: (account: Account) => void;
	getAccount: (id: string) => Account | undefined;
	removeAccount: (id: string) => void;
	getAccountBySignerAndDerivationPath: ({
		signer,
		derivationPath,
	}: {
		signer: Signer;
		derivationPath: DerivationPath;
	}) => Account | undefined;
	deriveAccount: ({
		derivationPath,
		signer,
	}: {
		derivationPath: DerivationPath;
		signer: Signer;
	}) => Promise<Account>;
	// Wallet actions - Danger zone
	importWallet: ({ mnemonic }: { mnemonic: string }) => Promise<void>;
	getRootKey: () => Promise<{ privateKey: string; seedId: string } | undefined>;
	generateMnemonic: () => string;
	// Signer actions
	sign: ({
		payload,
		signer,
		derivationPath,
		options,
	}: {
		payload: unknown;
		type: number;
		signer: Signer;
		derivationPath: DerivationPath;
		options?: number[];
	}) => Promise<string>;
};

export type VaultStore = VaultData & VaultActions;

const initialState: VaultData = {
	accounts: [],
};

const _getSigner = (_: Signer) => MinaSigner.createSigner();

export const vaultStore = createStore<VaultStore>()(
	persist(
		immer((set, get) => ({
			...initialState,
			addAccount: (account) =>
				set(({ accounts }) => {
					accounts.push(account);
				}),
			getAccount: (id) => get().accounts.find((account) => account.id === id),
			removeAccount: (id) =>
				set(({ accounts }) => {
					const index = accounts.findIndex((account) => account.id === id);
					accounts.splice(index, 1);
				}),
			getAccountBySignerAndDerivationPath: ({ signer, derivationPath }) => {
				const derivationPathString = derivationPath.toString();
				return get().accounts.find(
					(account) =>
						account.signer === signer &&
						account.derivationPath.toString() === derivationPathString,
				);
			},
			deriveAccount: async ({ derivationPath, signer }) => {
				const { getRootKey, accounts } = get();
				const rootKey = await getRootKey();
				if (!rootKey) throw new Error("Root private key not found");
				const _signer = _getSigner(signer);
				const childPrivateKey = await _signer.deriveChildPrivateKey({
					derivationPath,
					rootPrivateKey: rootKey.privateKey,
				});
				const address = await _signer.getPublicKey({
					privateKey: childPrivateKey,
				});
				if (accounts.find((account) => account.address === address))
					throw new Error("Account already exists");
				const account = {
					id: nanoid(),
					address,
					derivationPath,
					signer,
					seedId: rootKey.seedId,
				};
				set(({ accounts }) => {
					accounts.push(account);
				});
				return account;
			},
			importWallet: async ({ mnemonic }) => {
				const seed = mnemonicToSeedSync(mnemonic);
				const password = HDKey.fromMasterSeed(seed).privateExtendedKey;
				const id = nanoid();
				const passwordCredential = new PasswordCredential({
					id: id,
					name: id,
					password,
				});
				await navigator.credentials.store(passwordCredential);
			},
			generateMnemonic: () => generateMnemonic(wordlist, 256),
			getRootKey: async () => {
				const passwordCredential = (await navigator.credentials.get({
					password: true,
				})) as PasswordCredential;
				if (!passwordCredential.password) return undefined;
				return {
					privateKey: passwordCredential.password,
					seedId: passwordCredential.id,
				};
			},
			sign: async ({ payload, type, derivationPath, signer, options }) => {
				const { getAccountBySignerAndDerivationPath, getRootKey } = get();
				const seedId = getAccountBySignerAndDerivationPath({
					signer,
					derivationPath: derivationPath,
				})?.seedId;
				if (!seedId) throw new Error("Seed not found");
				const signerInstance = _getSigner(signer);
				const rootKey = await getRootKey();
				if (!rootKey) throw new Error("Root private key not found");
				if (rootKey.seedId !== seedId) throw new Error("Seed ID mismatch");
				const childPrivateKey = await signerInstance.deriveChildPrivateKey({
					derivationPath: derivationPath,
					rootPrivateKey: rootKey.privateKey,
				});
				return signerInstance.sign({
					payload: payload as never,
					childPrivateKey,
					type: type as 0 | 1 | 2,
					network: (options?.[0] ?? 0) as 0 | 1,
				});
			},
		})),
		{ name: "silex_vault" },
	),
);

export const getVault = () =>
	readable(vaultStore.getState(), vaultStore.subscribe);
