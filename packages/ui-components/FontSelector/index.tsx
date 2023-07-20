import { Box, Tooltip } from "@chakra-ui/react";
import {
    GroupBase,
    OptionBase,
    Select,
    SelectComponentsConfig,
    chakraComponents,
    useChakraSelectProps,
} from "chakra-react-select";

import { useState } from "react";

interface FontOption extends OptionBase {
    label: string;
    value: string;
}

const fontOptionComponent: SelectComponentsConfig<
    FontOption,
    false,
    GroupBase<FontOption>
> = {
    Option: ({ children, ...props }) => (
        <chakraComponents.Option {...props}>
            <span style={{ fontFamily: props.data.value }}>{children}</span>
        </chakraComponents.Option>
    ),
};

interface FontSelectorProps {
    onChange?: (option: FontOption) => void;
    fontFamilyList: FontOption[];
}

export function FontSelector({ fontFamilyList, onChange }: FontSelectorProps) {
    const [selectedFont, setSelectedFont] = useState<FontOption>(
        fontFamilyList[0]
    );
    const fontsOptions = fontFamilyList.map((option) => ({
        ...option,
    }));

    const selectProps = useChakraSelectProps({
        defaultValue: selectedFont,
        options: fontsOptions,
        closeMenuOnSelect: true,
        components: fontOptionComponent,
        value: selectedFont,
        onChange: (option) => {
            onChange?.(option as FontOption);
            setSelectedFont(option as FontOption);
        },
    });

    return (
        <Tooltip label="Select font">
            <Box as="span" fontFamily={selectedFont.value} width={"200px"}>
                <Select {...selectProps} />
            </Box>
        </Tooltip>
    );
}
