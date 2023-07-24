import {
    ColorPicker,
    Flex,
    FontSelector,
    HStack,
    TooltipButton,
} from "ui-components";
import {
    FontDownload,
    FormatBold,
    FormatItalic,
    FormatUnderlined,
    Mode,
    Redo,
    StrikethroughS,
    TextDecrease,
    TextIncrease,
    Undo,
} from "@mui/icons-material";
import { useEffect, useRef } from "react";

import { ColorPickerHandle } from "ui-components/ColorPicker";
import { editor } from "../../editorInstance";

const fontFamilyList = [
    {
        label: "Arial",
        value: "Arial",
    },
    {
        label: "Segoe UI",
        value: "Segoe UI",
    },
    {
        label: "Ink Free",
        value: "Ink Free",
    },
    {
        label: "Fantasy",
        value: "Fantasy",
    },
    {
        label: "Cursive",
        value: "Cursive",
    },
    {
        label: "Monospace",
        value: "Monospace",
    },
    {
        label: "Roboto",
        value: "Roboto",
    },
];

const colors = [
    { name: "black", value: "black" },
    { name: "#6b7280", value: "#6b7280" },
    { name: "#ef4444", value: "#ef4444" },
    { name: "#374151", value: "#374151" },
    { name: "#10b981", value: "#10b981" },
    { name: "#3b82f6", value: "#3b82f6" },
    { name: "#1e40af", value: "#1e40af" },
    { name: "#f59e0b", value: "#f59e0b" },
    { name: "#f97316", value: "#f97316" },
    { name: "#8b5cf6", value: "#8b5cf6" },
    { name: "transparent", value: "transparent" },
];

export function Toolbar() {
    const textColorPickerRef = useRef<ColorPickerHandle>(null);
    const backgroundColorPickerRef = useRef<ColorPickerHandle>(null);

    useEffect(() => {
        editor.observe(["moveCursor", "pointerdown"], (ed) => {
            const { color, background } = ed.getCursorTextStyle();

            const curFontColor = colors.find((c) => c.value === color);
            if (curFontColor) {
                textColorPickerRef.current?.setColor(curFontColor);
            }

            const curBackgroundColor = colors.find(
                (c) => c.value === background
            );
            console.log({ curBackgroundColor, background });
            if (curBackgroundColor) {
                backgroundColorPickerRef.current?.setColor(curBackgroundColor);
            }
        });
    }, []);

    return (
        <Flex justifyContent="center" gap="2" flexWrap="wrap" p={4}>
            <HStack>
                <TooltipButton
                    label="Undo"
                    onClick={() => {
                        editor.undo();
                    }}
                >
                    <Undo />
                </TooltipButton>
                <TooltipButton
                    label="Redo"
                    onClick={() => {
                        editor.redo();
                    }}
                >
                    <Redo />
                </TooltipButton>
            </HStack>
            <FontSelector
                fontFamilyList={fontFamilyList}
                onChange={(font) => {
                    editor.updateSelectedText("fontfamily", font.value);
                }}
            />
            <HStack>
                <TooltipButton
                    label="Increase font size"
                    onClick={() => {
                        editor.updateSelectedText("increaseFontSize");
                    }}
                >
                    <TextIncrease />
                </TooltipButton>
                <TooltipButton
                    label="Decrease font size"
                    onClick={() => {
                        editor.updateSelectedText("decreaseFontSize");
                    }}
                >
                    <TextDecrease />
                </TooltipButton>
            </HStack>
            <HStack>
                <TooltipButton label="Bold">
                    <FormatBold
                        onClick={() => {
                            editor.updateSelectedText("bold");
                        }}
                    />
                </TooltipButton>
                <TooltipButton
                    label="Italic"
                    onClick={() => {
                        editor.updateSelectedText("italic");
                    }}
                >
                    <FormatItalic />
                </TooltipButton>
                <TooltipButton
                    label="underline"
                    onClick={() => {
                        editor.updateSelectedText("underline");
                    }}
                >
                    <FormatUnderlined />
                </TooltipButton>
                <TooltipButton
                    label="strike through line"
                    onClick={() => {
                        editor.updateSelectedText("lineThrough");
                    }}
                >
                    <StrikethroughS />
                </TooltipButton>
            </HStack>
            <HStack>
                <ColorPicker
                    colors={colors}
                    icon={FontDownload}
                    label="Text color"
                    onChange={(color) => {
                        editor.updateSelectedText("color", color.value);
                    }}
                    ref={textColorPickerRef}
                />
                <ColorPicker
                    colors={colors}
                    icon={Mode}
                    label="highlight color"
                    defaultColor={{
                        name: "transparent",
                        value: "transparent",
                    }}
                    onChange={(color) => {
                        editor.updateSelectedText("background", color.value);
                    }}
                    ref={backgroundColorPickerRef}
                />
            </HStack>
        </Flex>
    );
}
