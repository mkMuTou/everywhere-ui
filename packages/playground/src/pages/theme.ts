import {
    ColorScheme,
    setSchemeConfig,
    ThemeStyle,
    setThemeConfig,
} from "@every-where/ui/theme";
import defaultTheme from "@every-where/ui/styles?url";
import blueTheme from "@/assets/theme/blue.less?url";
import { repeat } from "lit/directives/repeat.js";
import { html } from "lit";

setThemeConfig({
    storage: {
        get() {
            return localStorage.getItem("theme-style") || "default";
        },
        set(value) {
            localStorage.setItem("theme-style", value);
        },
    },
    default: "default",
    themes: [
        {
            name: "默认",
            key: "default",
            url: defaultTheme,
        },
        {
            name: "蓝色",
            key: "blue",
            url: blueTheme,
        },
    ],
});

setSchemeConfig({
    storage: {
        get() {
            return localStorage.getItem("color-scheme") || "auto";
        },
        set(value) {
            localStorage.setItem("color-scheme", value);
        },
    },
});
const schemes = ColorScheme.COLOR_SCHEMES;
function changeColorScheme(colorScheme: ColorScheme) {
    ColorScheme.switchColorScheme(colorScheme.getKey());
}
function changeTheme(theme: ThemeStyle) {
    ThemeStyle.switchTheme(theme);
}

export default function () {
    return html`${repeat(Object.keys(schemes), (key) => {
            const item = schemes[key];
            return html`<ew-button @click=${() => changeColorScheme(item)}>
                ${item}
            </ew-button>`;
        })}
        <hr />
        ${repeat(Object.keys(ThemeStyle.THEME_STYLES), (key) => {
            const item = ThemeStyle.THEME_STYLES[key];
            return html`<ew-button @click=${() => changeTheme(item)}>
                ${item}
            </ew-button>`;
        })} `;
}
