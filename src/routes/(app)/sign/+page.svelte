<script lang="ts">
import { goto } from "$app/navigation";
import { page } from "$app/stores";
import TopBar from "$lib/components/top-bar.svelte";
import { signatureToTransportable } from "$lib/transport";
import type { TransportableSignRequest } from "$lib/types";
import { arrayToPath } from "$lib/utils";
import { getVault } from "$lib/vault";
import { onMount } from "svelte";
import { derived, writable } from "svelte/store";

const vault = getVault();
const signRequest = writable<TransportableSignRequest | undefined>(undefined);
const address = derived(signRequest, ($signRequest) => {
	if (!$signRequest) return;
	return $vault.getAccountBySignerAndDerivationPath({
		signer: $signRequest.signer,
		derivationPath: $signRequest.derivationPath,
	})?.address;
});

onMount(() => {
	const pageState = $page.state as {
		signRequest: TransportableSignRequest | undefined;
	};
	console.log(">>>REQ", pageState.signRequest);
	signRequest.set(pageState.signRequest);
});

const onSign = async () => {
	if (!$signRequest) return;
	if (!$address) return;
	const signature = await $vault.sign($signRequest as never);
	const transportableSignature = signatureToTransportable({
		signature,
		publicKey: $address,
	});
	return goto("/sign/success", {
		state: { signature: transportableSignature },
	});
};
</script>

<div class="flex flex-1 flex-col">
    <TopBar title="Signature Request" />
    <div class="flex flex-1 flex-col gap-4 p-4">
        {#if $signRequest}
            <div class="flex flex-1 flex-col gap-4">
                <div class="flex justify-between gap-2">
                    <div>Signature Type</div>
                    <div class="capitalize">{$signRequest.type}</div>
                </div>
                <div class="flex justify-between gap-2">
                    <div>Network</div>
                    <div class="capitalize">{$signRequest.signer}</div>
                </div>
                <div class="flex justify-between gap-2">
                    <div>Derivation Path</div>
                    <div>{arrayToPath($signRequest.derivationPath)}</div>
                </div>
                <div class="flex flex-col">
                    <label for="address" class="label">Public Key</label>
                    <textarea
                        id="address"
                        class="textarea textarea-bordered resize-none"
                        value={$address}
                        readonly
                    />
                </div>
                <div class="flex flex-col">
                    <label for="options" class="label">Options</label>
                    <textarea
                        id="options"
                        class="textarea textarea-bordered resize-none"
                        value={JSON.stringify($signRequest.options ?? "")}
                        readonly
                    />
                </div>
                <div class="flex flex-col">
                    <label for="message" class="label">Payload</label>
                    <textarea
                        id="message"
                        class="textarea textarea-bordered resize-none"
                        value={JSON.stringify($signRequest.payload)}
                        readonly
                    />
                </div>
                <div class="flex-1" />
                <div class="flex flex-col gap-2">
                    <button class="btn btn-primary w-full" on:click={onSign}
                        >Sign</button
                    >
                    <button class="btn btn-neutral">Reject</button>
                </div>
            </div>
        {:else}
            <div>Sign request not found</div>
        {/if}
    </div>
</div>
