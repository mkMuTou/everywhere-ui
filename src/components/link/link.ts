import { LitElement, html, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import styles from "./link.less?inline";

@customElement("ew-link")
export class EwLink extends LitElement {
    static styles = unsafeCSS(styles);

    @property({ type: String })
    href?: string;
    @property({ type: String, reflect: true })
    type: "primary" | "success" | "warning" | "error" | "info" | "default" =
        "default";
    @property({ type: Boolean })
    disabled = false;
    @property({ type: String, reflect: true })
    underline: "none" | "hover" | "always" = "hover";
    render() {
        return html`
            <a class="ew-link" link=${ifDefined(this.href)} part="link">
                <slot></slot>
            </a>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "ew-link": EwLink;
    }
}
