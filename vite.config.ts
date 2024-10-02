import { sveltekit } from "@sveltejs/kit/vite";
import { SvelteKitPWA } from "@vite-pwa/sveltekit";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [
		sveltekit(),
		SvelteKitPWA({
			strategies: "generateSW",
			srcDir: "src",
			filename: "service-worker.ts",
			manifest: {
				name: "Silex",
				short_name: "Silex",
				start_url: "/",
				scope: "/",
				display: "standalone",
				theme_color: "#000000",
				background_color: "#000000",
			},
			injectManifest: {
				globPatterns: ["client/**/*.{js,css,ico,png,svg,webp,woff,woff2}"],
			},
			workbox: {
				globPatterns: ["client/**/*.{js,css,ico,png,svg,webp,woff,woff2}"],
				maximumFileSizeToCacheInBytes: 15 * 1024 * 1024,
			},
			devOptions: {
				enabled: true,
				suppressWarnings: process.env.SUPPRESS_WARNING === "true",
				type: "module",
				navigateFallback: "/",
			},
			kit: {
				includeVersionFile: true,
			},
		}),
	],
});
