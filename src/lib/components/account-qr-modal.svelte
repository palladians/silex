<script lang="ts">
import { getTransportableAccount } from "$lib/transport";
import { getVault } from "$lib/vault";
import QRCode from "@castlenine/svelte-qrcode";
import { type Writable, derived } from "svelte/store";

export let accountId: Writable<string>;

const vault = getVault();

const account = derived([vault, accountId], ([$vault, $accountId]) => {
	return $vault.accounts.find((account) => account.id === $accountId);
});

const transportableAccount = derived(account, ($account) => {
	if (!$account) return "";
	return getTransportableAccount({
		address: $account.address,
		signer: $account.signer,
		derivationPath: $account.derivationPath,
	});
});
</script>

<dialog id="qr_modal" class="modal">
    {#key $accountId}
        <div class="modal-box">
            {#if $account}
                <QRCode data={$transportableAccount} isResponsive />
            {/if}
        </div>
        <form method="dialog" class="modal-backdrop">
            <button>close</button>
        </form>
    {/key}
</dialog>
