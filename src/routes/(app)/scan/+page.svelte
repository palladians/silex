<script lang="ts">
import { goto } from "$app/navigation";
import TopBar from "$lib/components/top-bar.svelte";
import { transportableToSignRequest } from "$lib/transport";
import {
	Html5QrcodeScanner,
	type QrcodeErrorCallback,
	type QrcodeSuccessCallback,
} from "html5-qrcode";
import { onMount } from "svelte";

let html5QrcodeScanner: Html5QrcodeScanner;

const onScanSuccess: QrcodeSuccessCallback = (decodedText) => {
	const signRequest = transportableToSignRequest(decodedText);
	html5QrcodeScanner.clear();
	return goto("/sign", { state: { signRequest } });
};

const onScanFailure: QrcodeErrorCallback = (error) => {
	console.warn(`Code scan error = ${error}`);
};

onMount(() => {
	html5QrcodeScanner = new Html5QrcodeScanner(
		"reader",
		{ fps: 10, qrbox: { width: 250, height: 250 } },
		false,
	);
	html5QrcodeScanner.render(onScanSuccess, onScanFailure);
	return () => {
		html5QrcodeScanner.clear();
	};
});
</script>

<div class="flex flex-1 flex-col">
    <TopBar title="Scan" />
    <div id="reader" class="flex-1"></div>
</div>
