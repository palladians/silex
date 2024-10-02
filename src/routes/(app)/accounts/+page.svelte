<script lang="ts">
import AccountQrModal from "$lib/components/account-qr-modal.svelte";
import AccountTile from "$lib/components/account-tile.svelte";
import TopBar from "$lib/components/top-bar.svelte";
import { getVault } from "$lib/vault";
import { writable } from "svelte/store";

const vault = getVault();
const qrAccountId = writable("");

const openQrModal = (id: string) => {
	qrAccountId.set(id);
	const modal = document.getElementById("qr_modal") as HTMLDialogElement;
	modal.showModal();
};
</script>

<AccountQrModal accountId={qrAccountId} />

<div class="flex flex-col gap-4">
    <TopBar title="Accounts">
        <a href="/accounts/new" class="btn">Create</a>
    </TopBar>
    <div class="p-4">
        <div class="flex flex-col gap-4">
            {#each $vault.accounts as account}
                {#if account}
                    <AccountTile
                        {account}
                        exportQr={() => openQrModal(account.id)}
                    />
                {/if}
            {/each}
        </div>
    </div>
</div>
