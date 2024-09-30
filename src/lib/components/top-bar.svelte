<script lang="ts">
export const title = "";
</script>

<header
    class="flex justify-between items-center bg-neutral p-4 fixed left-0 top-0 right-0 z-10"
>
    <h1 class="text-lg">{title}</h1>
    <slot />
</header>
