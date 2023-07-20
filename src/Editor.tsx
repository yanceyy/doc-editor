import { useEffect, useRef } from "react";

import { Flex } from "ui-components";
import { editor } from "./editorInstance";

export function Editor() {
    const canvasRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        window.addEventListener(
            "keydown",
            function (event) {
                // Check if the keydown event is either ctrl+s (Windows/Linux) or command+s (macOS)
                if (
                    (event.keyCode == 83 && (event.ctrlKey || event.metaKey)) ||
                    event.keyCode == 19
                ) {
                    event.preventDefault();
                    // Perhaps alert the user that they can't use that keyboard shortcut
                    // alert("The 'save' keyboard shortcut has been disabled.");
                    return false;
                }
            },
            false
        );
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            editor.setContainer(canvas);
            editor.createPage(0);
            editor.render(false);
        }
        return () => {
            editor?.removeAll();
        };
    }, []);

    return (
        <Flex
            id="page-canvas"
            p={4}
            marginTop="70px"
            paddingTop="30px"
            paddingBottom="30px"
            marginBottom="20px"
            backgroundColor="gray.200"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
            minHeight={"100vh"}
            ref={canvasRef}
        ></Flex>
    );
}
