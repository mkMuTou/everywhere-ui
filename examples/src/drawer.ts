import { html } from "lit";
import { effect, ref } from "@vue/reactivity";
import { ref as litRef, createRef } from "lit/directives/ref.js";

import { EwDrawer } from "../../src/index";

const drawerRef = createRef<EwDrawer>();

const showDrawer = ref(false);
effect(() => {
    // drawer?.toggle(showDrawer.value);
});
export default function () {
    return html` <ew-button
            @click=${() => {
                drawerRef.value?.toggle();
            }}
            >打开抽屉</ew-button
        >
        <ew-drawer
            ${litRef(drawerRef)}
            direction="left"
            size="200px"
            min-size="30vw"
            max-size="80vw"
            .mask-closable=${false}
            resize
            id="drawer">
            <div slot="title">这是标题</div>
            <h3>底部抽屉内容</h3>
            <p>这是一个从底部唤起的抽屉，无遮罩</p>
        </ew-drawer>`;
}
