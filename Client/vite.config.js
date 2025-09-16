import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { createCA } from "mkcert";

const ca = await createCA({
  organization: "KIHSO",
  countryCode: "NP",
  state: "Bagmati",
  locality: "CHITWAN",
  validity: 365,
});

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    https: {
      key: ca.key,
      cert: ca.cert,
    },
    port: 5173,
  },
});
