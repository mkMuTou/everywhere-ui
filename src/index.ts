import packageJson from "../package.json";
import "@/assets/favicon.svg";

// 从 package.json 读取版本号（核心）
export const version = packageJson.version;

export * as ThemeUtils from "./utils/theme";

export { EwButton } from "./components/button";
export { EwDrawer } from "./components/drawer";
export { EwIcon } from "./components/icon";
export { EwLink } from "./components/link";
