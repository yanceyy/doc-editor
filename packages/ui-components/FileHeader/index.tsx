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
            position="fixed"
            width="100%"
            backgroundColor="white"
            top="0"
        >
            {titleRow && (
                <Flex>
                    <Box>{titleRow}</Box>
                </Flex>
            )}

            {menuRow && (
                <Flex>
                    <Box>{menuRow}</Box>
                </Flex>
            )}

            <Flex align="center" justify="center">
                <Box>{actionRow}</Box>
            </Flex>
        </Flex>
    );
}
