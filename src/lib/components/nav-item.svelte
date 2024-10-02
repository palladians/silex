<script lang="ts">
export let href = "";
export let label = "";
</script>

<a {href} class="flex flex-col items-center justify-center gap-1">
    <slot size={28} />
    <span class="text-sm text-white">{label}</span>
</a>
