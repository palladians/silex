<script lang="ts">
import { goto } from "$app/navigation";
import TopBar from "$lib/components/top-bar.svelte";
import { vaultStore } from "$lib/vault";
import { readable, writable } from "svelte/store";

const vault = readable(vaultStore.getState(), vaultStore.subscribe);

const network = writable("mina");
const derivationPath = writable("m/44'/12586'/0'/0/0");

const onSubmit = async () => {
	await $vault.deriveAccount({
		derivationPath: $derivationPath,
		signer: $network,
	});
	goto("/accounts");
};
</script>

<div class="flex flex-1 justify-between flex-col gap-4">
    <TopBar title="Derive Account" />
    <form id="accountForm" class="flex flex-col p-4 gap-4" on:submit={onSubmit}>
        <div class="flex flex-col gap-2">
            <label for="network">Network</label>
            <select class="select select-bordered" bind:value={$network}>
                <option value="mina">Mina</option>
            </select>
        </div>
        <div class="flex flex-col gap-2">
            <label for="network">Derivation Path</label>
            <input class="input input-bordered" bind:value={$derivationPath} />
        </div>
    </form>
    <div class="flex p-4">
        <button form="accountForm" class="btn btn-primary w-full"
            >Derive Account</button
        >
    </div>
</div>
