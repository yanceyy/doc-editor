import { FileFooter, ZoomSlider } from "ui-components";

import { editor } from "../../editorInstance";

export function Footer() {
    return (
        <FileFooter
            leftMenu={null}
            rightMenu={
                <ZoomSlider
                    onChange={(value) => {
                        editor.setZoom(value / 100);
                    }}
                />
            }
        />
    );
}
