import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), tailwindcss()],
	base: "/cy-block/", // penting untuk GitHub Pages,
	resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
