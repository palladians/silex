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

{#if $online && !development}
    <div class="flex flex-1 flex-col justify-center items-center min-h-screen">
        <p>You are online. It puts your vault at risk.</p>
    </div>
{:else}
    <slot />
{/if}
