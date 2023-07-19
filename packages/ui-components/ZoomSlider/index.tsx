import {
    Box,
    Button,
    HStack,
    Slider,
    SliderFilledTrack,
    SliderThumb,
    SliderTrack,
    useControllableState,
} from "@chakra-ui/react";

export function ZoomSlider() {
    const [value, setValue] = useControllableState({ defaultValue: 100 });
    return (
        <HStack spacing="6px">
            <Button
                colorScheme="teal"
                variant="ghost"
                size="xs"
                onClick={() => setValue(value - 1)}
            >
                -
            </Button>
            <Slider
                width="150px"
                aria-label="Zoom document"
                onChange={setValue}
                value={value}
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
                onClick={() => setValue(value + 1)}
            >
                +
            </Button>
            <Box width="50px">{`${value}%`}</Box>
        </HStack>
    );
}
