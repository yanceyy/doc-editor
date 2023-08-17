import { createContext, ReactNode } from "react";
import type { FC } from "react";

import { editor } from "../editorInstance.ts";
export const editorContext = createContext(editor);

interface Props {
    children: ReactNode;
}

export const EditorProvider: FC<Props> = ({ children }) => {
    return (
        <editorContext.Provider value={editor}>
            {children}
        </editorContext.Provider>
    );
};
