import { LitElement, html, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import styles from "./drawer.less?inline";
import { booleanType } from "@/utils/converter";

/**
 * 多方向抽屉组件 是否展示关闭按钮
 * @fires open-change - 抽屉显示状态变化时触发
 */
@customElement("ew-drawer")
export class EwDrawer extends LitElement {
    static styles = unsafeCSS(styles);

    /** 控制抽屉显示/隐藏 */
    @property({ type: Boolean, reflect: true })
    isOpen = false;

    /** 抽屉弹出方向 (top/bottom/left/right) */
    @property({ reflect: true })
    direction: "top" | "bottom" | "left" | "right" = "right";

    /** 抽屉尺寸 (宽度/高度，根据方向自动适配) */
    @property()
    size = "300px";

    /** 最小尺寸 */
    @property({ attribute: "min-size" })
    minSize?: string;

    /** 最大尺寸 */
    @property({ attribute: "max-size" })
    maxSize?: string;

    @property({ type: Boolean, reflect: true })
    resize = false;

    /** 是否显示遮罩 */
    @property({
        type: Boolean,
        attribute: "show-mask",
        reflect: true,
        converter: (v) => booleanType(v),
    })
    showMask = true;

    /** 点击遮罩是否关闭抽屉 */
    @property({
        type: Boolean,
        attribute: "mask-closable",
        converter: (v) => booleanType(v),
    })
    maskClosable = true;

    /** 是否展示关闭按钮 */
    @property({
        type: Boolean,
        attribute: "show_close",
        converter: (v) => booleanType(v),
    })
    showClose = true;

    /** 内部状态：是否正在过渡动画中 */
    @state()
    private _isTransitioning = false;

    /** 监听 open 属性变化，触发动画状态和事件 */
    protected willUpdate(changedProperties: Map<string, unknown>) {
        if (changedProperties.has("isOpen")) {
            const newOpen = this.isOpen;
            this._isTransitioning = true;

            // 触发状态变化事件
            this.dispatchEvent(
                new CustomEvent("open-change", {
                    detail: { open: newOpen },
                    bubbles: true,
                    composed: true,
                }),
            );

            // 动画结束后重置过渡状态
            if (!newOpen) {
                setTimeout(() => {
                    this._isTransitioning = false;
                }, 300);
            } else {
                this._isTransitioning = false;
            }
        }

        // 根据方向设置尺寸样式
        this.updateSizeStyle();
    }

    /** 根据方向更新抽屉尺寸样式 */
    private updateSizeStyle() {
        const drawer = this.shadowRoot?.querySelector(".drawer") as HTMLElement;
        if (!drawer) return;

        // 重置所有尺寸样式
        drawer.style.width = "";
        drawer.style.height = "";

        // 根据方向设置对应尺寸
        if (this.direction === "left" || this.direction === "right") {
            drawer.style.width = this.size;
            if (this.minSize) {
                drawer.style.minWidth = this.minSize;
            }
            if (this.maxSize) {
                drawer.style.maxWidth = this.maxSize;
            }
        } else {
            drawer.style.height = this.size;
            if (this.minSize) {
                drawer.style.minHeight = this.minSize;
            }
            if (this.maxSize) {
                drawer.style.maxHeight = this.maxSize;
            }
        }
    }

    /** 关闭抽屉 */
    close() {
        this.toggle(false);
    }

    /** 打开抽屉 */
    open() {
        this.toggle(true);
    }

    /**
     * 切换抽屉状态
     * @param isOpen - 是否打开抽屉，不传时根据当前状态决定
     */
    toggle(isOpen?: boolean) {
        if (this._isTransitioning) {
            return;
        }
        if (isOpen !== undefined) {
            this.isOpen = isOpen;
            return;
        }
        this.isOpen = !this.isOpen;
    }

    /** 遮罩点击处理 */
    private handleMaskClick() {
        if (this.maskClosable && this.showMask) {
            this.close();
        }
    }

    render() {
        return html`
            <!-- 遮罩层 -->
            ${this.showMask &&
            html`<div class="mask" @click=${this.handleMaskClick}></div>`}

            <!-- 抽屉主体 -->
            <div class="drawer drawer--${this.direction}">
                <!-- 抽屉标题（可选，可通过slot自定义） -->
                <slot name="title"></slot>
                ${this.showClose &&
                html`<button class="drawer__close" @click=${this.close}>
                    ×
                </button>`}

                <!-- 抽屉内容槽 -->
                <div class="drawer__content">
                    <slot></slot>
                </div>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "ew-drawer": EwDrawer;
    }
}
