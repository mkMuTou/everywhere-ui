import { defineConfig } from "vite";
export default defineConfig({
    optimizeDeps: {
        include: ["@everywhere/ui"],
    },
    server: {
        host: "0.0.0.0",
        watch: {
            ignored: ["!**/node_modules/@everywhere/ui/**"],
        },
    },
});
