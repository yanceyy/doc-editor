import { FileHeader } from "ui-components";
import { Toolbar } from "../Toolbar";

export function Header() {
    return (
        <FileHeader titleRow={null} menuRow={null} actionRow={<Toolbar />} />
    );
}
