import mitt from "mitt";
export const emitter = mitt<{
    "color-scheme-change": ColorScheme;
    "prefers-color-scheme-change": "dark" | "light";
    "theme-style-change": ThemeStyle;
}>();
export interface ColorSchemeConfig {
    storage?: {
        get(): string | PromiseLike<string>;
        set(value: string): void;
    };
}
let schemeConfig: ColorSchemeConfig;
export function setSchemeConfig(config: ColorSchemeConfig) {
    schemeConfig = config;
    if (config.storage) {
        Promise.resolve(config.storage.get()).then((scheme) => {
            ColorScheme.switchColorScheme(scheme);
        });
    }
    return ColorScheme;
}

let currentColorScheme: ColorScheme;

/** 明暗模式 */
export class ColorScheme {
    static readonly COLOR_SCHEMES: Record<string, ColorScheme> = {};
    static current = ColorScheme.COLOR_SCHEMES.auto;
    private key: string;
    private name: string;

    constructor(key: string, name: string) {
        this.key = key;
        this.name = name;
        ColorScheme.COLOR_SCHEMES[key] = this;
    }
    getName() {
        return this.name;
    }
    getKey() {
        return this.key;
    }
    valueOf() {
        return this.key;
    }
    toString() {
        return this.name;
    }
    static get(key: string) {
        return ColorScheme.COLOR_SCHEMES[key];
    }
    static switchColorScheme(colorScheme: ColorScheme | string) {
        let color: ColorScheme;
        if (typeof colorScheme === "string") {
            color = ColorScheme.get(colorScheme);
        } else {
            color = colorScheme;
        }
        if (!color) {
            console.error("Invalid color scheme");
        }
        if (currentColorScheme === color) return;
        currentColorScheme = color;
        emitter.emit("color-scheme-change", currentColorScheme);
        schemeConfig?.storage?.set(color.getKey());
        setColorScheme();
        return color;
    }
    static getCurrent() {
        return currentColorScheme;
    }
}
/** 监听主题变化 */
const colorSchemeQuery = window.matchMedia("(prefers-color-scheme: dark)");
function setColorScheme() {
    let scheme = currentColorScheme.valueOf();
    if (scheme === "auto") {
        handleColorSchemeChange(colorSchemeQuery);
        colorSchemeQuery.addEventListener("change", handleColorSchemeChange);
    } else {
        document.documentElement.setAttribute("color-scheme", scheme);
    }
}

function handleColorSchemeChange(e: MediaQueryListEvent | MediaQueryList) {
    const scheme: "dark" | "light" = e.matches ? "dark" : "light";
    document.documentElement.setAttribute("color-scheme", scheme);
    emitter.emit("prefers-color-scheme-change", scheme);
}

new ColorScheme("auto", "自动");
new ColorScheme("light", "浅色");
new ColorScheme("dark", "深色");

export interface ThemeStyleConfig {
    storage?: {
        get(): string | PromiseLike<string>;
        set(value: string): void;
    };
    themes?: ThemeStyle[] | { key: string; name: string; url: string }[];
    default?: string;
}
let themeConfig: ThemeStyleConfig;

export function setThemeConfig(config: ThemeStyleConfig) {
    themeConfig = config;
    if (config.themes) {
        config.themes.forEach((theme) => {
            if (theme instanceof ThemeStyle) {
                ThemeStyle.register(theme);
            } else {
                ThemeStyle.register(theme.key, theme.name, theme.url);
            }
        });
    }
    if (config.storage) {
        Promise.resolve(config.storage.get()).then((theme) => {
            ThemeStyle.switchTheme(theme)
                .catch(() => {
                    if (themeConfig.default) {
                        ThemeStyle.switchTheme(themeConfig.default);
                    }
                })
                .catch(() => {
                    console.error("Invalid theme style");
                });
        });
    }
    return ThemeStyle;
}
/** 当前主题样式 */
let currentThemeStyle: ThemeStyle;

/** 主题样式 */
export class ThemeStyle {
    static readonly THEME_STYLES: Record<string, ThemeStyle> = {};
    private key: string;
    private name: string;
    private url: string;
    /**
     *
     * @param key 主题id
     * @param name 样式名
     * @param url 样式路径，可以为项目本地路径也可以为网络资源
     */
    constructor(key: string, name: string, url: string) {
        this.key = key;
        this.name = name;
        this.url = url;
    }
    getName() {
        return this.name;
    }
    getKey() {
        return this.key;
    }
    valueOf() {
        return this.key;
    }
    toString() {
        return this.name;
    }
    static get(key: string) {
        return ThemeStyle.THEME_STYLES[key];
    }
    /**
     * 根据主题key判断主题是否注册
     * @param key 主题key
     */
    static has(key: string): boolean;
    /**
     * 判断主题是否注册
     * @param themeStyle 主题样式
     */
    static has(themeStyle: ThemeStyle): boolean;
    static has(themeStyle: ThemeStyle | string) {
        let key: string;
        if (typeof themeStyle === "string") {
            key = themeStyle;
        } else {
            key = themeStyle.getKey();
        }
        return ThemeStyle.THEME_STYLES[key] !== undefined;
    }
    static clear() {
        for (const key in ThemeStyle.THEME_STYLES) {
            delete ThemeStyle.THEME_STYLES[key];
        }
    }
    /**
     * 根据主题key切换主题样式
     * @param key 主题key
     */
    static switchTheme(key: string): Promise<ThemeStyle>;
    /**
     * 切换主题样式
     * @param themeStyle 主题样式
     */
    static switchTheme(themeStyle: ThemeStyle): Promise<ThemeStyle>;
    static async switchTheme(themeStyle: ThemeStyle | string) {
        let theme: ThemeStyle;
        if (typeof themeStyle === "string") {
            theme = ThemeStyle.get(themeStyle);
        } else {
            theme = themeStyle;
        }
        if (!theme) {
            throw new Error("Invalid theme style");
        }
        if (currentThemeStyle === theme) return;
        currentThemeStyle = theme;
        await loadTheme(theme.url);
        themeConfig?.storage?.set(theme.getKey());
        emitter.emit("theme-style-change", currentThemeStyle);
        return theme;
    }
    /** 获取当前主题样式 */
    static getCurrent() {
        return currentThemeStyle;
    }

    /** 注册主题样式 */
    static register(theme: ThemeStyle): ThemeStyle;
    static register(key: string, name: string, url: string): ThemeStyle;
    static register(arg1: string | ThemeStyle, name?: string, url?: string) {
        let theme: ThemeStyle;
        if (arg1 instanceof ThemeStyle) {
            theme = arg1;
        } else if (arg1 && name && url) {
            theme = new ThemeStyle(arg1, name, url);
        } else {
            throw new Error("Invalid arguments");
        }
        ThemeStyle.THEME_STYLES[theme.key] = theme;
        return theme;
    }
}
/** 保存当前生效的 link 元素 */
let currentLink: HTMLLinkElement;

/**
 * 动态加载 CSS 主题文件
 * @param path - 主题文件路径（本地相对路径或完整 URL）
 */
function loadTheme(path: string): Promise<void> {
    return new Promise((resolve, reject) => {
        if (!path) {
            reject(new Error("Theme path is required"));
            return;
        }

        // 浏览器环境检查（SSR 保护）
        if (typeof document === "undefined") {
            reject(
                new Error(
                    "loadTheme can only be called in browser environment",
                ),
            );
            return;
        }

        // 创建新的 link 元素
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.type = "text/css";
        link.href = path;

        // 处理加载成功
        link.onload = () => {
            // 移除旧的 link（如果有）
            if (currentLink && currentLink.parentNode) {
                currentLink.parentNode.removeChild(currentLink);
            }
            // 更新当前 link 引用
            currentLink = link;
            resolve();
        };

        // 处理加载失败
        link.onerror = () => {
            // 加载失败时不改变当前主题，仅 reject
            // 同时移除刚才添加的失败 link（避免残留）
            if (link.parentNode) {
                link.parentNode.removeChild(link);
            }
            reject(new Error(`Failed to load theme: ${path}`));
        };

        // 添加到 <head> 开始加载
        document.head.appendChild(link);
    });
}
