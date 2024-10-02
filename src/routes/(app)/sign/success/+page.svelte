<script lang="ts">
import { page } from "$app/stores";
import TopBar from "$lib/components/top-bar.svelte";
import QRCode from "@castlenine/svelte-qrcode";
import { onMount } from "svelte";
import { writable } from "svelte/store";

const transportableSignature = writable<string | undefined>(undefined);

onMount(() => {
	const pageState = $page.state as {
		signature: string | undefined;
	};
	transportableSignature.set(pageState.signature);
});
</script>

<div class="flex flex-1 flex-col">
    <TopBar title="Signed Data" />
    <div class="flex flex-1 flex-col justify-between p-4">
        <div class="flex flex-col gap-8">
            <p>
                Scan the QR code to transport the signature back to your
                software wallet.
            </p>
            {#if $transportableSignature}
                <QRCode data={$transportableSignature} isResponsive />
            {/if}
        </div>
        <a href="/accounts" class="btn btn-primary">Done</a>
    </div>
</div>
