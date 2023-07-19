import {
    Box,
    Button,
    ColorPicker,
    Flex,
    FontSelector,
    Stack,
} from "ui-components";
import {
    FormatBold,
    FormatItalic,
    FormatUnderlined,
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
    "gray.900",
    "gray.500",
    "red.500",
    "gray.700",
    "green.500",
    "blue.500",
    "blue.800",
    "yellow.500",
    "orange.500",
    "purple.500",
    "pink.500",
];

export function ToolBar() {
    return (
        <Flex justifyContent="center" gap="2">
            <Box p={4}>
                <Stack direction="row" spacing={4} align="center">
                    <ColorPicker colors={colors} />
                    <FontSelector fontFamilyList={fontFamilyList} />
                    <Button colorScheme="teal" variant="ghost">
                        <TextIncrease />
                    </Button>
                    <Button colorScheme="teal" variant="ghost">
                        <TextDecrease />
                    </Button>
                    <Button colorScheme="teal" variant="ghost">
                        <FormatBold />
                    </Button>
                    <Button colorScheme="teal" variant="ghost">
                        <FormatItalic />
                    </Button>
                    <Button colorScheme="teal" variant="ghost">
                        <FormatUnderlined />
                    </Button>
                    <Button colorScheme="teal" variant="ghost">
                        <StrikethroughS />
                    </Button>
                </Stack>
            </Box>
        </Flex>
    );
}
