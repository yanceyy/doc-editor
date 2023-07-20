import {
    Box,
    ColorPicker,
    Flex,
    FontSelector,
    Stack,
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
    { name: "gray.500", value: "#6b7280" },
    { name: "red.500", value: "#ef4444" },
    { name: "gray.700", value: "#374151" },
    { name: "green.500", value: "#10b981" },
    { name: "blue.500", value: "#3b82f6" },
    { name: "blue.800", value: "#1e40af" },
    { name: "yellow.500", value: "#f59e0b" },
    { name: "orange.500", value: "#f97316" },
    { name: "purple.500", value: "#8b5cf6" },
    { name: "pink.500", value: "#ec4899" },
    { name: "transparent", value: "transparent" },
];

export function Toolbar() {
    return (
        <Flex justifyContent="center" gap="2">
            <Box p={4}>
                <Stack direction="row" spacing={4} align="center">
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
                    <FontSelector
                        fontFamilyList={fontFamilyList}
                        onChange={(font) => {
                            editor.updateSelectedText("fontfamily", font.value);
                        }}
                    />
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
                    <ColorPicker
                        colors={colors}
                        icon={FontDownload}
                        label="Text color"
                        onChange={(color) => {
                            editor.updateSelectedText("color", color.value);
                        }}
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
                            editor.updateSelectedText(
                                "background",
                                color.value
                            );
                        }}
                    />
                </Stack>
            </Box>
        </Flex>
    );
}
