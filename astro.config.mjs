import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import db from "@astrojs/db";
import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
	integrations: [tailwind(), db()],
	security: {
		checkOrigin: true,
	},
	vite: {
		optimizeDeps: {
			exclude: ["astro:db"],
		},
	},
	output: "server",
	adapter: node({
		mode: "standalone",
	}),
});
