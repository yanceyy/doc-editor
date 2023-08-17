import { editorContext } from "./EditorProvider.tsx";
import { useContext } from "react";

export default function useEditor() {
    return useContext(editorContext);
}
