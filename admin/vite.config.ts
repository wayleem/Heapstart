import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
	plugins: [react()],
	server: {
		port: 5174, // This is Vite's default port
	},
	resolve: {
		alias: {
			"@components": "/src/components",
			"@pages": "/src/pages",
			"@store": "/src/store",
			"@hooks": "/src/hooks",
			"@assets": "/src/assets",
			"@types": "/src/types",
			"@utils": "/src/utils",
		},
	},
});
