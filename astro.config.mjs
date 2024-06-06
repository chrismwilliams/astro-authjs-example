import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import db from "@astrojs/db";
import node from "@astrojs/node";

import auth from "auth-astro";

// https://astro.build/config
export default defineConfig({
	integrations: [tailwind(), db(), auth()],
	security: {
		checkOrigin: true,
	},
	output: "server",
	adapter: node({
		mode: "standalone",
	}),
});
