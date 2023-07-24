import { Carousel, Flex } from "ui-components";
import { HStack, useMediaQuery } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

import { debounce } from "shared/utils";
import { editor } from "./editorInstance";

export function Editor() {
    const canvasRef = useRef<HTMLDivElement>(null);
    const [thumbnails, setThumbnails] = useState<{ src: string; id: string }[]>(
        []
    );

    // single media query with no options
    const [isLargerThan1024] = useMediaQuery("(min-width: 1024px)");

    useEffect(() => {
        window.addEventListener(
            "keydown",
            function (event) {
                // Check if the keydown event is either ctrl+s (Windows/Linux) or command+s (macOS)
                if (event.code == "KeyS" && (event.ctrlKey || event.metaKey)) {
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
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        const debouncedRender = debounce(async () => {
            const img = await editor.getImgBlobs();
            setThumbnails(img);
        }, 800);

        editor.observe("render", debouncedRender);

        return () => {
            editor.unObserve("render", debouncedRender);
        };
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
        <HStack alignItems="start" marginBottom="20px" marginTop="70px">
            {isLargerThan1024 && (
                <Carousel
                    alignItems="center"
                    justify="start"
                    width="250px"
                    maxHeight="85vh"
                    position={"sticky"}
                    overflowY={"auto"}
                    top={"100px"}
                    margin={6}
                    spacing={8}
                    direction="column"
                    thumbnails={thumbnails}
                />
            )}
            <Flex
                id="page-canvas"
                p={4}
                paddingTop="30px"
                paddingBottom="30px"
                backgroundColor="gray.200"
                justifyContent="center"
                alignItems="center"
                flexDirection="column"
                minHeight={"100vh"}
                width={"100vw"}
                ref={canvasRef}
            />
        </HStack>
    );
}
