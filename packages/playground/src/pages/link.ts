import { html } from "lit";
import "@every-where/ui/link";
export default function () {
    return html`
        <ew-card header="ew-link">
            <ew-link underline="none">Default</ew-link>
            <ew-link type="primary">Primary</ew-link>
            <ew-link type="success" underline="always">Success</ew-link>
            <ew-link type="warning">Warning</ew-link>
            <ew-link type="error">Error</ew-link>
            <ew-link type="info">Info</ew-link>
            <ew-link href="http://baidu.com" target="_blank">baidu</ew-link>
        </ew-card>
        <ew-card header="ew-link disabled">
            <ew-link disabled underline="none">Default</ew-link>
            <ew-link disabled type="primary">Primary</ew-link>
            <ew-link disabled type="success" underline="always"
                >Success</ew-link
            >
            <ew-link disabled type="warning">Warning</ew-link>
            <ew-link disabled type="error">Error</ew-link>
            <ew-link disabled type="info">Info</ew-link>
        </ew-card>
    `;
}
