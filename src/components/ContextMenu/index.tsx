import { ContextMenu } from "ui-components/ContextMenu";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { getCmdByPlatform } from "shared/utils.ts";
import useEditor from "../../context/useEditor.tsx";

export function TextContextMenu() {
    const [position, setPosition] = useState<{ top: number; left: number }>({
        top: 0,
        left: 0,
    });
    const [isOpen, setIsOpen] = useState(false);
    const editor = useEditor();
    useEffect(() => {
        editor.observe("contextmenu", (_, e) => {
            const { clientX, clientY } = e as MouseEvent;
            const scrollY = window.scrollY;
            const props = {
                top: clientY + scrollY - 60,
                left: clientX,
            };
            setPosition(props);
            setIsOpen(true);
        });

        document.body.addEventListener("click", () => {
            setIsOpen(false);
        });
    }, []);

    return createPortal(
        <ContextMenu
            left={position.left}
            top={position.top}
            isOpen={isOpen}
            items={[
                {
                    label: "Copy",
                    onClick: () => {
                        editor.copySelection();
                    },
                    shortcutKeyDesc: `${getCmdByPlatform()}+c`,
                },
                {
                    label: "Delete",
                    onClick: () => {
                        editor.delete();
                    },
                },
            ]}
        />,
        document.body
    );
}
