<script lang="ts">
import TopBar from "$lib/components/top-bar.svelte";
import { truncateString } from "$lib/utils";
import { vaultStore } from "$lib/vault";
import { readable } from "svelte/store";

const vault = readable(vaultStore.getState(), vaultStore.subscribe);
</script>

<div class="flex flex-col gap-4">
    <TopBar title="Accounts">
        <a href="/accounts/new" class="btn">Create</a>
    </TopBar>
    <div class="p-4">
        <div class="flex flex-col gap-2">
            {#each $vault.accounts as account}
                {#if account}
                    <div class="card bg-neutral">
                        <div class="card-body">
                            <p>
                                {truncateString({
                                    value: account.address,
                                    endCharCount: 5,
                                    firstCharCount: 5,
                                })}
                            </p>
                            <p>{account.derivationPath}</p>
                            <p>{account.signer}</p>
                            <div class="card-actions justify-end">
                                <button
                                    class="btn"
                                    on:click={() =>
                                        $vault.removeAccount(account.id)}
                                    >Remove</button
                                >
                            </div>
                        </div>
                    </div>
                {/if}
            {/each}
        </div>
    </div>
</div>
