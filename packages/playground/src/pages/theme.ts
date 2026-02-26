import {
    ColorScheme,
    setSchemeConfig,
    // ThemeStyle,
    // setThemeConfig,
} from "@every-where/ui/theme";
import { repeat } from "lit/directives/repeat.js";
import { html } from "lit";

/* function getUrl(url: string) {
    const fileUrl = new URL(`../assets/${url}.less`, import.meta.url);
    return fileUrl.pathname;
}

setThemeConfig({
    storage: {
        get() {
            return localStorage.getItem("theme-style") || "future";
        },
        set(value) {
            localStorage.setItem("theme-style", value);
        },
    },
    themes:[
        {name:'前途光明',key:'future',url:getUrl('future')}
    ]
}); */

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
