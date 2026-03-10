import { resolve } from "path";
import { defineConfig } from "vite";
export default defineConfig({
    resolve: {
        alias: {
            "@": resolve(__dirname, "src"),
        },
    },
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
