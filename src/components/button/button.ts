import { LitElement, html, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "./button.less?inline";

@customElement("ew-button")
export class EwButton extends LitElement {
    static styles = unsafeCSS(styles);

    /** 按钮类型 */
    @property({ type: String, reflect: true })
    type?: "default" | "primary" | "success" | "warning" | "error" | "info" =
        "default";
    /** 按钮是否禁用 */
    @property({ type: Boolean })
    disabled = false;
    /** 按钮的尺寸 */
    @property({ type: String, reflect: true })
    size: "small" | "medium" | "large" = "medium";
    /** 按钮是否为圆形 */
    @property({ type: Boolean })
    circle = false;
    /** loading */
    @property({ type: Boolean })
    loading = false;

    render() {
        return html`
            <button
                part="button"
                class="ew-button"
                ?disabled="${this.disabled}"
                @click="${this._handleClick}">
                <slot></slot>
            </button>
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
        "ew-button": EwButton;
    }
}
