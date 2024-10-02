<script lang="ts">
import { goto } from "$app/navigation";
import TopBar from "$lib/components/top-bar.svelte";
import { getVault } from "$lib/vault";
import { toast } from "svelte-sonner";
import { writable } from "svelte/store";

const vault = getVault();

const showMnemonic = writable(false);
const mnemonic = $vault.generateMnemonic();

const importWallet = async () => {
	try {
		await $vault.importWallet({ mnemonic });
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
            {#if $showMnemonic}
                <textarea
                    class="textarea textarea-bordered resize-none h-40 text-lg text-gray-200"
                    >{mnemonic}</textarea
                >
            {:else}
                <button class="btn" on:click={() => showMnemonic.set(true)}
                    >I'm ready</button
                >
            {/if}
        </div>
        <button
            class="btn btn-neutral"
            disabled={!$showMnemonic}
            on:click={importWallet}>Continue</button
        >
    </div>
</div>
