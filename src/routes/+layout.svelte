<script>
    import "../app.css";
    import { env } from "$env/dynamic/public";
    import { onMount } from "svelte";
    import { Toaster } from "svelte-sonner";
    import { writable } from "svelte/store";

    const online = writable(false);
    const development = env.PUBLIC_DEV === "true";

    onMount(() => {
        online.set(navigator.onLine);
        window.addEventListener("online", () => online.set(true));
        window.addEventListener("offline", () => online.set(false));

        return () => {
            window.removeEventListener("online", () => online.set(true));
            window.removeEventListener("offline", () => online.set(false));
        };
    });
</script>

<Toaster />

<slot />
