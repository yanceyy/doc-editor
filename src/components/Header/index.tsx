import { FileHeader } from "ui-components";
import { ToolBar } from "../ToolBar";

export function Header() {
    return (
        <FileHeader titleRow={null} menuRow={null} actionRow={<ToolBar />} />
    );
}
