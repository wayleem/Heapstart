/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_API_BASE_URL: string;
	readonly VITE_ADMIN_TOKEN: string;
	// Add other environment variables here
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
