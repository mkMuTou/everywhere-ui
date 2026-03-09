import { LitElement, html, nothing, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import styles from "./link.less?inline";
import type { TsHintType } from "@/utils/variables";

@customElement("ew-link")
export default class EwLink extends LitElement {
    static styles = unsafeCSS(styles);

    @property()
    href?: string;
    @property()
    target: "_blank" | "_parent" | "_self" | "_top" = "_self";
    @property({ type: String, reflect: true })
    type: TsHintType = "default";
    @property({ type: Boolean })
    disabled = false;
    @property({ type: String, reflect: true })
    underline: "none" | "hover" | "always" = "hover";
    render() {
        return html`
            <a
                class="ew-link"
                href=${ifDefined(this.href)}
                part="link"
                target=${this.href ? this.target : nothing}
                @click=${this._handleClick}>
                <slot name="icon"></slot>
                <slot></slot>
            </a>
        `;
    }

    private _handleClick(e: TouchEvent) {
        if (!this.disabled) {
            e.stopPropagation();
            this.dispatchEvent(new CustomEvent("click", { detail: e.detail }));
        }
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "ew-link": EwLink;
    }
}
