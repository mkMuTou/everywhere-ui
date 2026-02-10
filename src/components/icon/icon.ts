import { LitElement, html, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import { ifDefined } from "lit/directives/if-defined.js";
import styles from "./icon.less?inline";

@customElement("ew-icon")
export class EwIcon extends LitElement {
    static styles = unsafeCSS(styles);
    @property()
    type: string = "solid";
    @property()
    name?: string;
    @property()
    size?: string;
    render() {
        const styles = {
            "font-size": this.size,
        };
        return html` <slot>
            ${!!this.name
                ? html`<i
                      class="fa-${this.type} fa-${this.name}"
                      style=${styleMap(styles)}></i>`
                : "name is required"}
        </slot>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "ew-icon": EwIcon;
    }
}
