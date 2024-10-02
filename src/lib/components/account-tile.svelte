<script lang="ts">
import { goto } from "$app/navigation";
import { arrayToPath, truncateString } from "$lib/utils";
import { type Account, getVault } from "$lib/vault";
import { MoreVerticalIcon } from "lucide-svelte";

const vault = getVault();

export let account: Account;
export let exportQr: () => void;

const removeAccount = async () => {
	$vault.removeAccount(account.id);
	goto("/accounts");
};
</script>

<div class="card bg-neutral">
    <div class="card-body flex-row">
        <div class="flex flex-col flex-1">
            <p>
                {truncateString({
                    value: account.address,
                    endCharCount: 5,
                    firstCharCount: 5,
                })}
            </p>
            <p>{arrayToPath(account.derivationPath)}</p>
            <p>{account.signer}</p>
        </div>
        <div class="flex flex-col items-end gap-2">
            <div class="dropdown dropdown-end">
                <button tabindex="0" class="btn btn-square"
                    ><MoreVerticalIcon size={16} /></button
                >
                <ul
                    tabindex="0"
                    class="dropdown-content menu bg-gray-800 rounded-box z-[1] w-52 p-2 shadow"
                >
                    <li><button on:click={removeAccount}>Remove</button></li>
                </ul>
            </div>
            <button class="btn" on:click={exportQr}>Export QR</button>
        </div>
    </div>
</div>
