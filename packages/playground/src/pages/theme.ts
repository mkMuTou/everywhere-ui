import {
    ColorScheme,
    setSchemeConfig,
    ThemeStyle,
    setThemeConfig,
} from "../../src/utils/theme";
import { repeat } from "lit/directives/repeat.js";
import { html } from "lit";

setThemeConfig({
    storage: {
        get() {
            return localStorage.getItem("theme-style") || "future";
        },
        set(value) {
            localStorage.setItem("theme-style", value);
        },
    },
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

export default function () {
    return html`${repeat(Object.keys(schemes), (key) => {
        const item = schemes[key];
        return html`<ew-button @click=${() => changeColorScheme(item)}
            >${item}</ew-button
        >`;
    })}`;
}
