import { LitElement, html, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import styles from "./card.less?inline";
import type { TsHintType } from "@/utils/variables";
import { booleanType } from "@/utils/converter";

@customElement("ew-card")
export default class EwCard extends LitElement {
    static styles = unsafeCSS(styles);

    @property({ type: String })
    header?: string;
    @property({ type: String })
    footer?: string;
    @property({ type: String, reflect: true })
    shadow: "always" | "hover" | "never" = "always";
    /** 提示类型 */
    @property({ type: String })
    type?: TsHintType;
    @property({
        type: Boolean,
        attribute: "hid-line",
    })
    hidLine: boolean = false;

    @state()
    private hasHeader: boolean = false;
    @state()
    private hasFooter: boolean = false;

    private _handleSlotChange(name: "header" | "footer") {
        return (e: Event) => {
            const slot = e.target as HTMLSlotElement;
            // flatten: true 会将默认内容也计入
            const nodes = slot.assignedNodes({ flatten: true });
            // 过滤掉纯空白文本节点（可选）
            const hasContent = nodes.some(
                (node) =>
                    node.nodeType !== Node.TEXT_NODE ||
                    node.textContent?.trim(),
            );
            if (name === "header") {
                this.hasHeader = hasContent;
            } else {
                this.hasFooter = hasContent;
            }
        };
    }

    // private get has
    render() {
        const hasHeader = this.hasHeader || this.header;
        const hasFooter = this.hasFooter || this.footer;
        return html`
            <div class="ew-card" part="ew-card">
                <header class="${hasHeader ? "ew-card-header" : ""}">
                    <slot
                        name="header"
                        part="header"
                        @slotchange=${this._handleSlotChange("header")}>
                        ${this.header
                            ? html`<div class="ew-card-header-content">
                                  ${this.header}
                              </div>`
                            : ""}
                    </slot>
                </header>
                <hr
                    class="ew-card-line"
                    ?hidden="${this.hidLine || !hasHeader}" />
                <div class="ew-card-body">
                    <slot part="body"></slot>
                </div>
                <hr
                    class="ew-card-line"
                    ?hidden="${this.hidLine || !hasFooter}" />
                <footer class="${hasFooter ? "ew-card-footer" : ""}">
                    <slot
                        name="footer"
                        part="footer"
                        @slotchange=${this._handleSlotChange("footer")}
                        >${this.footer}</slot
                    >
                </footer>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "ew-card": EwCard;
    }
}
