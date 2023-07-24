import {
    Button,
    HStack,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Slider,
    SliderFilledTrack,
    SliderThumb,
    SliderTrack,
    useControllableState,
} from "@chakra-ui/react";

import { useCallback } from "react";

interface ZoomSliderProps {
    onChange?: (value: number) => void;
}

export function ZoomSlider({ onChange }: ZoomSliderProps) {
    const [value, setValue] = useControllableState({ defaultValue: 100 });
    const combineAction = useCallback(
        (value: number) => {
            setValue(value);
            onChange?.(value);
        },
        [onChange, setValue]
    );
    return (
        <HStack spacing="6px">
            <Button
                colorScheme="teal"
                variant="ghost"
                size="xs"
                onClick={() => combineAction(value - 1)}
            >
                -
            </Button>
            <Slider
                width="150px"
                aria-label="Zoom document"
                onChange={combineAction}
                value={value}
                step={5}
                min={50}
                max={200}
            >
                <SliderTrack>
                    <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
            </Slider>
            <Button
                colorScheme="teal"
                variant="ghost"
                size="xs"
                onClick={() => combineAction(value + 1)}
            >
                +
            </Button>
            <Menu>
                <MenuButton size="sm" as={Button}>{`${value}%`}</MenuButton>
                <MenuList textAlign="center">
                    {[50, 75, 100, 150, 200].map((value) => (
                        <MenuItem
                            textAlign="center"
                            onClick={() => combineAction(value)}
                        >
                            {value}%
                        </MenuItem>
                    ))}
                </MenuList>
            </Menu>
        </HStack>
    );
}
