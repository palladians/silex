<script>
    import BottomNavigation from "$lib/components/bottom-navigation.svelte";
</script>

<div class="flex flex-1 flex-col min-h-screen py-20">
    <main class="container mx-auto flex-1 flex flex-col">
        <slot></slot>
    </main>
    <BottomNavigation />
</div>
