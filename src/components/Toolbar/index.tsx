import {
    Box,
    ColorPicker,
    Flex,
    FontSelector,
    Stack,
    Tooltip,
    TooltipButton,
} from "ui-components";
import {
    FontDownload,
    FormatBold,
    FormatItalic,
    FormatUnderlined,
    Mode,
    StrikethroughS,
    TextDecrease,
    TextIncrease,
} from "@mui/icons-material";

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

export function ToolBar() {
    return (
        <Flex justifyContent="center" gap="2">
            <Box p={4}>
                <Stack direction="row" spacing={4} align="center">
                    <FontSelector fontFamilyList={fontFamilyList} />
                    <TooltipButton label="strike line">
                        <TextIncrease />
                    </TooltipButton>
                    <TooltipButton label="strike line">
                        <TextDecrease />
                    </TooltipButton>
                    <TooltipButton label="strike line">
                        <FormatBold />
                    </TooltipButton>
                    <TooltipButton label="strike line">
                        <FormatItalic />
                    </TooltipButton>
                    <TooltipButton label="strike line">
                        <FormatUnderlined />
                    </TooltipButton>
                    <TooltipButton label="strike line">
                        <StrikethroughS />
                    </TooltipButton>
                    <ColorPicker
                        colors={colors}
                        icon={FontDownload}
                        label="Text color"
                    />
                    <ColorPicker
                        colors={colors}
                        icon={Mode}
                        label="highlight color"
                        defaultColor={{
                            name: "transparent",
                            value: "transparent",
                        }}
                    />
                </Stack>
            </Box>
        </Flex>
    );
}
