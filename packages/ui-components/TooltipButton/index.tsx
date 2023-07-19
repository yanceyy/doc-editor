import { Button, Tooltip } from "@chakra-ui/react";

import type { ButtonProps } from "@chakra-ui/react";

interface TooltipButtonProps extends ButtonProps {
    label: string;
    children?: React.ReactNode;
    colorScheme?: string;
    variant?: string;
}

export function TooltipButton({
    children,
    label,
    ...props
}: TooltipButtonProps) {
    return (
        <Tooltip label={label}>
            <Button {...props}>{children}</Button>
        </Tooltip>
    );
}
