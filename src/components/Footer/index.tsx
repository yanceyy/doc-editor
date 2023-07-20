import { FileFooter, ZoomSlider } from "ui-components";

export function Footer() {
    return (
        <FileFooter
            leftMenu={null}
            rightMenu={
                <ZoomSlider
                    onChange={() => {
                        //TODO: Need to fix this
                        //editor.zoom(value / 100);
                    }}
                />
            }
        />
    );
}
