import { html } from "lit";
import "@every-where/ui/card";
export default function () {
    return html`
        <style>
            .ew-card-demo > ew-card::part(body) {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
            }
        </style>
        <div class="ew-card-demo">
            <ew-card shadow="never" header="content">
                <ew-card> Default </ew-card>
                <ew-card header="header attr" footer="footer attr">
                    body
                </ew-card>
            </ew-card>
            <ew-card shadow="never" header="shadow">
                <ew-card shadow="never"> never shadow </ew-card>
                <ew-card shadow="hover"> hover shadow </ew-card>
                <ew-card shadow="always"> always shadow </ew-card>
            </ew-card>
            <ew-card shadow="never" header="type" class="ew-card-type">
                <ew-card type="primary"> primary </ew-card>
                <ew-card type="success"> success </ew-card>
                <ew-card type="warning"> warning </ew-card>
                <ew-card type="error"> danger </ew-card>
                <ew-card type="info"> info </ew-card>
                <ew-card type="default"> default </ew-card>
            </ew-card>
            <ew-card shadow="never" header="slot">
                <ew-card>
                    <div slot="header">header slot</div>
                    default slot
                    <div slot="footer">footer slot</div>
                </ew-card>
            </ew-card>
            <ew-card shadow="never" header="hid-line">
                <ew-card hid-line footer="footer attr">
                    <div slot="header">header slot</div>
                    default slot
                </ew-card>
            </ew-card>
        </div>
    `;
}
