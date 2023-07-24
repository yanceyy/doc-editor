import {
    Box,
    Button,
    Popover,
    PopoverBody,
    PopoverCloseButton,
    PopoverContent,
    PopoverHeader,
    PopoverTrigger,
    SimpleGrid,
    Tooltip,
} from "@chakra-ui/react";
import React, { forwardRef, useImperativeHandle, useState } from "react";

import type { Color } from "shared/Types";
import { TooltipButton } from "../TooltipButton";

interface ColorPickerProps {
    colors: Color[];
    onChange?: (color: Color) => void;
    icon: React.FC;
    label: string;
    defaultColor?: Color;
}

export interface ColorPickerHandle {
    setColor: (color: Color) => void;
}

function _ColorPicker(
    { colors, onChange, label, defaultColor, icon: Icon }: ColorPickerProps,
    ref: React.Ref<unknown>
) {
    const [color, setColor] = useState<Color>(
        defaultColor || {
            name: "black",
            value: "black",
        }
    );

    useImperativeHandle(ref, () => ({
        setColor,
    }));

    return (
        <Popover>
            <PopoverTrigger>
                <Button aria-label={label}>
                    <Tooltip label={label}>
                        <Box>
                            <Icon />
                            <Box bg={color.value} w="100%" p="2px" />
                        </Box>
                    </Tooltip>
                </Button>
            </PopoverTrigger>
            <PopoverContent width="170px" borderColor="blue.800">
                <PopoverHeader
                    height="20px"
                    borderTopLeftRadius={5}
                    borderTopRightRadius={5}
                >
                    <PopoverCloseButton color="black" />
                </PopoverHeader>
                <PopoverBody>
                    <SimpleGrid columns={5} spacing={2}>
                        {colors.map((color) => (
                            <TooltipButton
                                key={color.name}
                                label={color.name}
                                background={color.value}
                                height="22px"
                                width="22px"
                                border="2px solid black"
                                padding={0}
                                minWidth="unset"
                                _hover={{ backgroundColor: color.value }}
                                borderRadius={3}
                                onClick={() => {
                                    setColor(color);
                                    onChange?.(color);
                                }}
                            ></TooltipButton>
                        ))}
                    </SimpleGrid>
                </PopoverBody>
            </PopoverContent>
        </Popover>
    );
}

export const ColorPicker = forwardRef<ColorPickerHandle, ColorPickerProps>(
    _ColorPicker
);
