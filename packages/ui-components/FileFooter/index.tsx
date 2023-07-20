import { Box, Flex } from "@chakra-ui/react";

interface FileFooterProps {
    leftMenu: React.ReactNode;
    rightMenu: React.ReactNode;
}

export function FileFooter({ leftMenu, rightMenu }: FileFooterProps) {
    return (
        <Flex
            as="footer"
            direction="row"
            p={1}
            position="fixed"
            justifyContent="space-between"
            bottom="0"
            width="100%"
            height="30px"
            backgroundColor="white"
        >
            <Flex>
                <Box>{leftMenu}</Box>
            </Flex>
            <Flex>
                <Box>{rightMenu}</Box>
            </Flex>
        </Flex>
    );
}
