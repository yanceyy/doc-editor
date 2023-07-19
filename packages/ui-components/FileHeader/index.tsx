import { Box, Flex, Text } from "@chakra-ui/react";

interface FileHeaderProps {
    titleRow: React.ReactNode;
    menuRow: React.ReactNode;
    actionRow: React.ReactNode;
}

export function FileHeader({ titleRow, menuRow, actionRow }: FileHeaderProps) {
    return (
        <Flex as="header" direction="column" p={4}>
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
