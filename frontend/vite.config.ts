import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    // Redirige /api vers le petit serveur de l'assistant
    proxy: { "/api": "http://localhost:3001" },
  },
});
