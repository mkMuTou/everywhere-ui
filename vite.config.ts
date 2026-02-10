import { defineConfig } from "vite";
import autoprefixer from "autoprefixer";
import postcssPxToRem from "postcss-pxtorem";
import { resolve, join } from "path";
import fs from "fs";
import dts from "vite-plugin-dts";

// 获取所有组件入口
function getComponentEntries() {
    const componentsDir = resolve(__dirname, "src/components");
    const dirs = fs.readdirSync(componentsDir);

    const entries: Record<string, string> = {};
    dirs.forEach((dir) => {
        const dirPath = join(componentsDir, dir);
        if (fs.statSync(dirPath).isDirectory()) {
            const indexPath = join(dirPath, "index.ts");
            if (fs.existsSync(indexPath)) {
                entries[dir] = indexPath;
            }
        }
    });

    return entries;
}

export default defineConfig({
    resolve: {
        alias: {
            "@": resolve(__dirname, "src"),
        },
    },
    assetsInclude: ["./src/types/themes/*.less"],
    build: {
        target: "es2018",
        outDir: "dist",
        assetsDir: "assets",
        /* lib: {
            entry: resolve(__dirname, "src/index.ts"),
            name: "everywhere-ui",
            formats: ["es", "umd"],
            fileName: (format) => `everywhere-ui.${format}.js`, // 统一文件名
        }, */
        rollupOptions: {
            external: ["mitt"],
            input: {
                main: resolve(__dirname, "src/index.ts"),
                ...getComponentEntries(),
            },
            output: {
                entryFileNames: (chunkInfo) => {
                    // 如果是组件入口
                    if (
                        Object.keys(getComponentEntries()).includes(
                            chunkInfo.name,
                        )
                    ) {
                        return `components/[name].js`;
                    }
                    // 主入口
                    return `everywhere-ui.[format].js`;
                },
                assetFileNames: "assets/[name].[hash].[ext]",
            },
        },
    },
    plugins: [
        dts({
            entryRoot: "src",
            outDir: "dist/types",
            tsconfigPath: resolve(__dirname, "tsconfig.json"),
            include: ["src/**/*"],
        }),
    ],
    css: {
        postcss: {
            plugins: [
                autoprefixer(),
                postcssPxToRem({
                    rootValue: 16,
                    propList: ["*"],
                    selectorBlackList: [],
                    minPixelValue: 4,
                    exclude: "/node_modules/",
                }),
            ],
        },
        preprocessorOptions: {
            less: {
                additionalData: `@import "@/styles/global.less";`,
                javascriptEnabled: true,
                math: "parens-division",
            },
        },
    },
    server: {
        host: "0.0.0.0",
    },
    optimizeDeps: {
        include: ["package.json"],
    },
});
