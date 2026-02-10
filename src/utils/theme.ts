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
    } else {
        registerPresetThemeStyle();
    }
    if (config.storage) {
        Promise.resolve(config.storage.get()).then((theme) => {
            ThemeStyle.switchTheme(theme);
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
    private readonly remote: boolean;
    /**
     *
     * @param key 主题id
     * @param name 样式名
     * @param url 样式路径，可以为项目本地路径也可以为网络资源
     * @param remote 是否为远程资源
     */
    constructor(
        key: string,
        name: string,
        url: string,
        remote: boolean = false,
    ) {
        this.key = key;
        this.name = name;
        this.url = url;
        this.remote = remote;
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
    static switchTheme(key: string): void;
    /**
     * 切换主题样式
     * @param themeStyle 主题样式
     */
    static switchTheme(themeStyle: ThemeStyle): void;
    static async switchTheme(themeStyle: ThemeStyle | string) {
        let theme: ThemeStyle;
        if (typeof themeStyle === "string") {
            theme = ThemeStyle.get(themeStyle);
        } else {
            theme = themeStyle;
        }
        if (!theme) {
            console.error("Invalid theme style");
        }
        if (currentThemeStyle === theme) return;
        currentThemeStyle = theme;
        await loadCss(theme.url, theme.remote);
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
function getUrl(url: string) {
    const fileUrl = new URL(`../styles/themes/${url}.less`, import.meta.url);
    return fileUrl.pathname;
}

/** 使用预设的主题样式 */
function registerPresetThemeStyle() {
    ThemeStyle.register("earch", "大地之光", getUrl("earch"));
    ThemeStyle.register("hope", "希望之光", getUrl("hope"));
    ThemeStyle.register("rapunzel", "乐佩公主", getUrl("rapunzel"));
    ThemeStyle.register("simple", "朴实无华", getUrl("simple"));
    ThemeStyle.register("fairy", "童话世界", getUrl("fairy"));
    ThemeStyle.register("sky", "海阔天空", getUrl("sky"));
    ThemeStyle.register("harvest", "丰收季节", getUrl("harvest"));
    ThemeStyle.register("future", "前途光明", getUrl("future"));
    ThemeStyle.register("classic", "经典永存", getUrl("classic"));
    return ThemeStyle;
}
async function loadCss(path: string, remote?: boolean) {
    if (remote || path.startsWith("http://") || path.startsWith("https://")) {
        await loadRemoteCSS(path);
    } else {
        await loadLocalCSS(path);
    }
}
async function loadLocalCSS(path: string) {
    try {
        await import(/* @vite-ignore */ path);
    } catch (err) {
        throw new Error(`Local CSS file not found: ${path}`);
    }
}

function loadRemoteCSS(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = url;
        link.onload = () => resolve();
        link.onerror = () =>
            reject(new Error(`Failed to load remote CSS: ${url}`));
        document.head.appendChild(link);
    });
}
