import { html } from "lit";
import "@every-where/ui/button";
export default function () {
    return html`
        ew-link
        <br />
        <ew-link underline="none">Default</ew-link>
        <ew-link type="error">Error</ew-link>
        <ew-link type="success" disabled underline="always">Success</ew-link>
        <br />
        type
        <br />
        <ew-button>Default</ew-button>
        <ew-button type="primary">Primary</ew-button>
        <ew-button type="success">Success</ew-button>
        <ew-button type="warning">Warning</ew-button>
        <ew-button type="error">Error</ew-button>
        <ew-button type="info">Info</ew-button>
        <br />
        capsule
        <br />
        <ew-button capsule>Default</ew-button>
        <ew-button capsule type="primary">Primary</ew-button>
        <ew-button capsule type="success">Success</ew-button>
        <ew-button capsule type="warning">Warning</ew-button>
        <ew-button capsule type="error">Error</ew-button>
        <ew-button capsule type="info">Info</ew-button>
        <br />
        disabled
        <br />
        <ew-button disabled>Default</ew-button>
        <ew-button disabled type="primary">Primary</ew-button>
        <ew-button disabled type="success">Success</ew-button>
        <ew-button disabled type="warning">Warning</ew-button>
        <ew-button disabled type="error">Error</ew-button>
        <ew-button disabled type="info">Info</ew-button>
        <br />
        plain
        <br />
        <ew-button plain>Default</ew-button>
        <ew-button plain type="primary">Primary</ew-button>
        <ew-button plain type="success">Success</ew-button>
        <ew-button plain type="warning">Warning</ew-button>
        <ew-button plain type="error">Error</ew-button>
        <ew-button plain type="info">Info</ew-button>
        <br />
        <ew-button disabled plain>Default</ew-button>
        <ew-button disabled plain type="primary">Primary</ew-button>
        <ew-button disabled plain type="success">Success</ew-button>
        <ew-button disabled plain type="warning">Warning</ew-button>
        <ew-button disabled plain type="error">Error</ew-button>
        <ew-button disabled plain type="info">Info</ew-button>
        <br />
        size
        <br />
        <ew-button type="primary" size="small">Small</ew-button>
        <ew-button type="primary" size="medium">Medium</ew-button>
        <ew-button type="primary" size="large">Large</ew-button>
    `;
}
