import { html } from "lit";
import "@every-where/ui";
export default function () {
    return html`
        <ew-link underline="none">default</ew-link>
        <ew-link type="error">error</ew-link>
        <ew-link type="success" disabled underline="always">success</ew-link>
        <br />
        <ew-button>default</ew-button>
        <span></span>
        <ew-button type="primary" circle>Primary</ew-button>
        <ew-button type="success" size="large">sucess large</ew-button>
        <ew-button disabled type="error">Disabled error</ew-button>
        <ew-button type="warning">Warning</ew-button>
        <ew-button type="info">Info</ew-button>
    `;
}
