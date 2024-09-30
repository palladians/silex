<script lang="ts">
import { goto } from "$app/navigation";
import TopBar from "$lib/components/top-bar.svelte";
import { vaultStore } from "$lib/vault";
import { validateMnemonic } from "@scure/bip39";
import { wordlist } from "@scure/bip39/wordlists/english";
import { toast } from "svelte-sonner";
import { derived, readable, writable } from "svelte/store";

const vault = readable(vaultStore.getState(), vaultStore.subscribe);

const mnemonic = writable("");
const mnemonicValid = derived(mnemonic, ($mnemonic) =>
	validateMnemonic($mnemonic, wordlist),
);

const importWallet = async () => {
	try {
		await $vault.importWallet({ mnemonic: $mnemonic });
		goto("/accounts");
	} catch (error) {
		toast.error(error.message);
	}
};
</script>

<div class="flex flex-1 flex-col">
    <TopBar title="Create Wallet" />
    <div class="flex flex-1 flex-col justify-between p-4">
        <div class="flex flex-col gap-4">
            <h2 class="text-gray-200 text-xl">Mnemonic Backup</h2>
            <p class="text-gray-400">
                Write down the following mnemonic phrase and keep it in a safe
                place. It will allow you to recover your wallet in case you lose
                access to your device. Make sure you're alone.
            </p>
            <textarea
                class="textarea textarea-bordered resize-none h-40 text-lg text-gray-200"
                bind:value={$mnemonic}
            />
        </div>
        <button
            class="btn btn-neutral"
            on:click={importWallet}
            disabled={!$mnemonicValid}>Continue</button
        >
    </div>
</div>
