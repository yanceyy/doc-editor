import {
    Button,
    Center,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverCloseButton,
    PopoverContent,
    PopoverHeader,
    PopoverTrigger,
    SimpleGrid,
} from "@chakra-ui/react";

import { useState } from "react";

interface ColorPickerProps {
    colors: string[];
    onChange?: (color: string) => void;
}

export function ColorPicker({ colors, onChange }: ColorPickerProps) {
    const [color, setColor] = useState("gray.500");

    return (
        <Popover variant="picker">
            <PopoverTrigger>
                <Button
                    aria-label={color}
                    background={color}
                    height="22px"
                    width="22px"
                    padding={0}
                    minWidth="unset"
                    borderRadius={3}
                    _hover={{ backgroundColor: color }}
                ></Button>
            </PopoverTrigger>
            <PopoverContent width="170px">
                <PopoverArrow bg={color} />
                <PopoverCloseButton color="white" />
                <PopoverHeader
                    height="100px"
                    backgroundColor={color}
                    borderTopLeftRadius={5}
                    borderTopRightRadius={5}
                    color="white"
                >
                    <Center height="100%">{color}</Center>
                </PopoverHeader>
                <PopoverBody>
                    <SimpleGrid columns={5} spacing={2}>
                        {colors.map((c) => (
                            <Button
                                key={c}
                                aria-label={c}
                                background={c}
                                height="22px"
                                width="22px"
                                padding={0}
                                minWidth="unset"
                                borderRadius={3}
                                onClick={() => {
                                    setColor(c);
                                    onChange?.(c);
                                }}
                            ></Button>
                        ))}
                    </SimpleGrid>
                </PopoverBody>
            </PopoverContent>
        </Popover>
    );
}
