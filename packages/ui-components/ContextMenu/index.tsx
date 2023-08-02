import { Menu, MenuList, MenuItem } from "@chakra-ui/react";

export interface ContextMenuProps {
    top: number;
    left: number;
    isOpen?: boolean;
    items: {
        label: string;
        onClick: () => void;
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
                            {item.label}
                        </MenuItem>
                    );
                })}
            </MenuList>
        </Menu>
    );
}
