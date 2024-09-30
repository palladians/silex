import { createStore } from "zustand/vanilla";
import { immer } from "zustand/middleware/immer";
import { match } from "ts-pattern";
import * as MinaSigner from "$lib/signers/mina";
import { nanoid } from "nanoid";
import { generateMnemonic, mnemonicToSeedSync } from "@scure/bip39";
import { wordlist } from "@scure/bip39/wordlists/english";
import { HDKey } from "@scure/bip32";

type DerivationPath = string;

type Signer = "mina";

type Account = {
  id: string;
  address: string;
  derivationPath: DerivationPath;
  signer: Signer;
  seedId: string;
};

type SigningOptions = {
  derivationPath: DerivationPath;
  signer: Signer;
  networkSpecifier?: string;
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
    seedId,
  }: {
    derivationPath: DerivationPath;
    signer: Signer;
    seedId: string;
  }) => Promise<Account>;
  // Wallet actions - Danger zone
  importWallet: ({
    mnemonic,
    pin,
  }: {
    mnemonic: string;
    pin?: string;
  }) => Promise<void>;
  getRootKey: () => Promise<{ privateKey: string; seedId: string } | undefined>;
  generateMnemonic: () => string;
  // Signer actions
  signTransaction: ({
    unsignedTransaction,
    options,
  }: {
    unsignedTransaction: any;
    options: SigningOptions;
  }) => Promise<string>;
  signMessage: ({
    message,
    options,
  }: {
    message: string;
    options: SigningOptions;
  }) => Promise<string>;
};

export type VaultStore = VaultData & VaultActions;

const initialState: VaultData = {
  accounts: [],
};

const _getSigner = (signer: Signer) =>
  match(signer)
    .with("mina", () => MinaSigner.createSigner())
    .exhaustive();

export const vaultStore = createStore<VaultStore>()(
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
        delete accounts[index];
      }),
    getAccountBySignerAndDerivationPath: ({ signer, derivationPath }) => {
      return get().accounts.find(
        (account) =>
          account.signer === signer &&
          account.derivationPath === derivationPath,
      );
    },
    deriveAccount: async ({ derivationPath, signer, seedId }) => {
      const { getRootKey } = get();
      const rootKey = await getRootKey();
      if (!rootKey?.privateKey) throw new Error("Root private key not found");
      const account = {
        id: nanoid(),
        address: "",
        derivationPath,
        signer,
        seedId,
      };
      set(({ accounts }) => {
        accounts.push(account);
      });
      return account;
    },
    importWallet: async ({ mnemonic, pin }) => {
      const seed = mnemonicToSeedSync(mnemonic, pin);
      const password = HDKey.fromMasterSeed(seed).privateExtendedKey;
      const id = nanoid();
      const passwordCredential = new PasswordCredential({
        id: id,
        name: id,
        password,
      });
      const storedCredential =
        await navigator.credentials.store(passwordCredential);
      console.log(storedCredential);
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
    signMessage: async ({ message, options }) => {
      const { getAccountBySignerAndDerivationPath, getRootKey } = get();
      const seedId = getAccountBySignerAndDerivationPath({
        signer: options.signer,
        derivationPath: options.derivationPath,
      })?.seedId;
      if (!seedId) throw new Error("Seed not found");
      const signer = _getSigner(options.signer);
      const rootKey = await getRootKey();
      if (!rootKey) throw new Error("Root private key not found");
      if (rootKey.seedId !== seedId) throw new Error("Seed ID mismatch");
      const childPrivateKey = await signer.deriveChildPrivateKey({
        derivationPath: options.derivationPath,
        rootPrivateKey: rootKey.privateKey,
      });
      return signer.signMessage({
        message,
        childPrivateKey,
        options: { minaNetwork: options.networkSpecifier ?? "mainnet" },
      });
    },
    signTransaction: async ({ unsignedTransaction, options }) => {
      const { getAccountBySignerAndDerivationPath, getRootKey } = get();
      const seedId = getAccountBySignerAndDerivationPath({
        signer: options.signer,
        derivationPath: options.derivationPath,
      })?.seedId;
      if (!seedId) throw new Error("Seed not found");
      const signer = _getSigner(options.signer);
      const rootKey = await getRootKey();
      if (!rootKey) throw new Error("Root private key not found");
      if (rootKey.seedId !== seedId) throw new Error("Seed ID mismatch");
      const childPrivateKey = await signer.deriveChildPrivateKey({
        derivationPath: options.derivationPath,
        rootPrivateKey: rootKey.privateKey,
      });
      return signer.signTransaction({
        unsignedTransaction,
        childPrivateKey,
        options: { minaNetwork: options.networkSpecifier ?? "mainnet" },
      });
    },
  })),
);
