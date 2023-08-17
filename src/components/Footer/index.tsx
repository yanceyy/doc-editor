import { FileFooter, ZoomSlider } from "ui-components";
import useEditor from "../../context/useEditor.tsx";

export function Footer() {
    const editor = useEditor();
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
