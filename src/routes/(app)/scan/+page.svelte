<script lang="ts">
import TopBar from "$lib/components/top-bar.svelte";
import { Html5QrcodeScanner } from "html5-qrcode";
import { onMount } from "svelte";

function onScanSuccess(decodedText, decodedResult) {
	// handle the scanned code as you like, for example:
	console.log(`Code matched = ${decodedText}`, decodedResult);
}

function onScanFailure(error) {
	// handle scan failure, usually better to ignore and keep scanning.
	// for example:
	console.warn(`Code scan error = ${error}`);
}

onMount(() => {
	const html5QrcodeScanner = new Html5QrcodeScanner(
		"reader",
		{ fps: 10, qrbox: { width: 250, height: 250 } },
		/* verbose= */ false,
	);
	html5QrcodeScanner.render(onScanSuccess, onScanFailure);
});
</script>

<div class="flex flex-1 flex-col">
    <TopBar title="Scan" />
    <div id="reader" class="flex-1"></div>
</div>
