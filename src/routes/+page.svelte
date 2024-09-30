<script lang="ts">
    import { vaultStore } from "$lib/vault";
    import { readable } from "svelte/store";

    const vault = readable(vaultStore.getState(), vaultStore.subscribe);

    const createWallet = async () => {
        const mnemonic = $vault.generateMnemonic();
        const wallet = await $vault.importWallet({ mnemonic, pin: "9978" });
        console.log(">>>WALL", wallet);
    };
</script>

<div>
    <button class="btn" on:click={createWallet}>create wallet</button>
</div>
