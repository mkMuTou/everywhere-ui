import { LitElement, html, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "./button.less?inline";
import type { TsHintType } from "@/utils/variables";

@customElement("ew-button")
export default class EwButton extends LitElement {
    static styles = unsafeCSS(styles);

    /** 按钮类型 */
    @property({ type: String })
    type?: TsHintType;
    /** 按钮是否禁用 */
    @property({ type: Boolean })
    disabled = false;
    /** 按钮的尺寸 */
    @property({ type: String, reflect: true })
    size: "small" | "medium" | "large" = "medium";
    /** 是否为胶囊按钮 */
    @property({ type: Boolean })
    capsule = false;
    /** 是否为朴素按钮 */
    @property({ type: Boolean })
    plain = false;
    /** loading */
    @property({ type: Boolean })
    loading = false;

    render() {
        return html`
            <button
                part="button"
                class="ew-button selector_1"
                ?disabled="${this.disabled}"
                @click="${this._handleClick}">
                <slot name="icon" part="icon">
                    <ew-icon
                        name="loading"
                        size="16"
                        class="ew-button__icon"
                        ?hidden="${!this.loading}"></ew-icon>
                </slot>
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
