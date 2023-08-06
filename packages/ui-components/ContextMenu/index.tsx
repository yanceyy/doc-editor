import { Menu, MenuList, MenuItem, Flex, Text } from "@chakra-ui/react";

export interface ContextMenuProps {
    top: number;
    left: number;
    isOpen?: boolean;
    items: {
        label: string;
        onClick: () => void;
        shortcutKeyDesc?: string;
    }[];
}

export function ContextMenu({
    top,
    left,
    items,
    isOpen = true,
}: ContextMenuProps) {
    return (
        <Menu isOpen={isOpen}>
            <MenuList top={top} left={left} position="absolute">
                {items.map((item) => {
                    return (
                        <MenuItem key={item.label} onClick={item.onClick}>
                            <Flex justifyContent="space-between" width="100%">
                                <Text>{item.label}</Text>
                                {item.shortcutKeyDesc ? (
                                    <Text fontSize="sm" color="gray.500">
                                        {item.shortcutKeyDesc}
                                    </Text>
                                ) : null}
                            </Flex>
                        </MenuItem>
                    );
                })}
            </MenuList>
        </Menu>
    );
}
