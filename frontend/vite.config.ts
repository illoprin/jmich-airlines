import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
	plugins: [vue()],
	server: {
		host: "localhost",
		port: 5000,
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "src"),
		}
	},
})
