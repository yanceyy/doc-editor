import { Image, Skeleton, Stack, Text, VStack } from "@chakra-ui/react";
import type { StackDirection, StackProps } from "@chakra-ui/react";

interface ThumbnailsProps {
    src: string;
    id: string;
}

interface CarouselProps extends StackProps {
    direction: StackDirection;
    thumbnails: ThumbnailsProps[];
}

export function Carousel({ thumbnails, ...others }: CarouselProps) {
    return (
        <Stack {...others}>
            {thumbnails.length === 0
                ? Array(3)
                      .fill(0)
                      .map(() => (
                          <VStack width="100%">
                              <Skeleton width="70%" aspectRatio={0.7} />
                          </VStack>
                      ))
                : thumbnails.map((img, index) => (
                      <VStack
                          as="a"
                          href={`#${img.id}`}
                          key={img.id}
                          aria-label={`page ${index + 1} of ${
                              thumbnails.length
                          }`}
                      >
                          <Image
                              _hover={{
                                  borderColor: "blue",
                                  borderWidth: "2px",
                              }}
                              border="1px solid black"
                              htmlWidth="150px"
                              src={img.src}
                          />
                          <Text fontSize="sm">
                              {index + 1}/{thumbnails.length}
                          </Text>
                      </VStack>
                  ))}
        </Stack>
    );
}
