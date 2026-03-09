import { defineConfig } from "vite";
import autoprefixer from "autoprefixer";
import postcssPxToRem from "postcss-pxtorem";
import { resolve } from "path";

export default defineConfig({
    resolve: {
        alias: {
            "@": resolve(__dirname, "src"),
        },
    },
    assetsInclude: ["./src/styles/theme.less"],
    build: {
        target: "es2021",
        assetsDir: "assets",
        outDir: "dist/umd", // 输出到 dist/umd
        minify: true, // UMD 通常用于生产环境直接引用，建议压缩
        lib: {
            formats: ["umd"],
            fileName: (format) => `everywhere-ui.${format}.js`,
            entry: resolve(__dirname, "src/index.ts"),
            name: "everywhere-ui",
        },
        rollupOptions: {
            external: [],
            // 用 output 数组分别为每个格式指定输出目录和文件名
            output: {
                globals: {},
                assetFileNames: (assetInfo) => {
                    if (assetInfo.name?.endsWith(".css")) {
                        return "everywhere-ui.css"; // UMD 通常合并为一个 css 文件
                    }
                    return "[name][extname]";
                },
            },
        },
    },
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
                additionalData: `@import "@/assets/styles/global.less";`,
                javascriptEnabled: true,
                math: "parens-division",
            },
        },
    },
    optimizeDeps: {
        include: ["package.json"],
    },
});
