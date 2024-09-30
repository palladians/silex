<script lang="ts">
export const href = "";
export const label = "";
</script>

<a {href} class="flex flex-col items-center justify-center gap-1">
    <slot size={28} />
    <span class="text-sm">{label}</span>
</a>
