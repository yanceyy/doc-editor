import { Image, Stack, VStack } from "@chakra-ui/react";
import type { StackDirection, StackProps } from "@chakra-ui/react";

interface ThumbnailsProps {
    src: string;
}

interface CarouselProps extends StackProps {
    direction: StackDirection;
    thumbnails: ThumbnailsProps[];
}

export function Carousel({ thumbnails, ...others }: CarouselProps) {
    return (
        <Stack {...others}>
            {thumbnails.map((img, index) => (
                <a href={`#page-${index}`}>
                    <VStack
                        aria-label={`page ${index + 1} of ${thumbnails.length}`}
                    >
                        <Image
                            _hover={{
                                borderColor: "blue",
                                borderWidth: "2px",
                            }}
                            border="1px solid black"
                            htmlWidth="150px"
                            key={index}
                            src={img.src}
                        />
                        <span>
                            {index + 1}/{thumbnails.length}
                        </span>
                    </VStack>
                </a>
            ))}
        </Stack>
    );
}
