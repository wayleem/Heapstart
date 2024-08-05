import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			"@components": "/src/components",
			"@pages": "/src/pages",
			"@store": "/src/store",
			"@hooks": "/src/hooks",
			"@assets": "/src/assets",
		},
	},
});
