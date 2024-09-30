<script lang="ts">
import NavItem from "$lib/components/nav-item.svelte";
import { QrCodeIcon, Settings2Icon, WalletMinimalIcon } from "lucide-svelte";
</script>

<menu
    class="border-t border-gray-600 flex flex-row justify-between p-4 fixed bottom-0 left-0 right-0 z-10"
>
    <NavItem href="/accounts" label="Accounts">
        <WalletMinimalIcon size={28} />
    </NavItem>
    <NavItem href="/scan" label="Scan">
        <QrCodeIcon size={28} />
    </NavItem>
    <NavItem href="/settings" label="Settings">
        <Settings2Icon size={28} />
    </NavItem>
</menu>
