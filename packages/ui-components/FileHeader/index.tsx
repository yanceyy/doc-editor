import { Box, Flex } from "@chakra-ui/react";

interface FileHeaderProps {
    titleRow: React.ReactNode;
    menuRow: React.ReactNode;
    actionRow: React.ReactNode;
}

export function FileHeader({ titleRow, menuRow, actionRow }: FileHeaderProps) {
    return (
        <Flex
            as="header"
            direction="column"
            p={4}
            position="fixed"
            width="100%"
            backgroundColor="white"
        >
            <Flex>
                <Box>{titleRow}</Box>
            </Flex>

            <Flex>
                <Box>{menuRow}</Box>
            </Flex>

            <Flex align="center" justify="center">
                <Box>{actionRow}</Box>
            </Flex>
        </Flex>
    );
}
