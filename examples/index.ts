import { html, render } from "lit";
import { join } from "lit/directives/join.js";
import { until } from "lit/directives/until.js";

import "../src/index";

const commons = [
    import("./src/theme"),
    import("./src/drawer"),
    import("./src/button"),
    import("./src/icon"),
];
function asyncRender() {
    return commons.map((item) => {
        return until(
            item.then((item) => html`<div>${item.default()}</div>`),
            "加载中。。。",
        );
    });
}
render(
    html`<h1>My UI Library Examples</h1>
        ${join(asyncRender(), html`<hr />`)} `,
    document.getElementById("app")!,
);
