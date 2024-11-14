import { GetProps, Stack, Text, styled, useTheme } from "tamagui";
import { forwardRef } from "react";

// Define size configurations
const SIZE_CONFIGS = {
  small: {
    height: 32,
    paddingHorizontal: 12,
    fontSize: 14,
  },
  medium: {
    height: 44,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  large: {
    height: 54,
    paddingHorizontal: 20,
    fontSize: 18,
  },
} as const;

// Create the styled button component
const StyledButton = styled(Stack, {
  name: "Button",
  borderRadius: 9999, // Circular edges
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "row",
  position: "relative",
  overflow: "hidden",

  // Variants
  variants: {
    size: {
      small: {
        height: SIZE_CONFIGS.small.height,
        paddingHorizontal: SIZE_CONFIGS.small.paddingHorizontal,
      },
      medium: {
        height: SIZE_CONFIGS.medium.height,
        paddingHorizontal: SIZE_CONFIGS.medium.paddingHorizontal,
      },
      large: {
        height: SIZE_CONFIGS.large.height,
        paddingHorizontal: SIZE_CONFIGS.large.paddingHorizontal,
      },
    },
    variant: {
      primary: {
        backgroundColor: "$primary",
        pressStyle: {
          backgroundColor: "$secondary",
          scale: 0.98,
        },
      },
      secondary: {
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: "$primary",
        pressStyle: {
          backgroundColor: "$primary",
          scale: 0.98,
        },
      },
      disabled: {
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: "$gray",
        opacity: 0.5,
        cursor: "not-allowed",
      },
    },
  },

  // Default props
  defaultVariants: {
    size: "medium",
    variant: "primary",
  },
});

// Create the styled text component
const ButtonText = styled(Text, {
  textAlign: "center",

  variants: {
    size: {
      small: {
        fontSize: SIZE_CONFIGS.small.fontSize,
      },
      medium: {
        fontSize: SIZE_CONFIGS.medium.fontSize,
      },
      large: {
        fontSize: SIZE_CONFIGS.large.fontSize,
      },
    },
    variant: {
      primary: {
        color: "$bg",
      },
      secondary: {
        color: "$primary",
      },
      disabled: {
        color: "$gray",
      },
    },
  },
});

// Props type
type ButtonProps = GetProps<typeof StyledButton> & {
  label: string;
};

// Main button component
export const Button = forwardRef<
  React.ElementRef<typeof StyledButton>,
  ButtonProps
>(({ label, size, variant, disabled, ...props }, ref) => {
  const buttonVariant = disabled ? "disabled" : variant ? variant : "primary";

  return (
    <StyledButton
      ref={ref}
      size={size}
      variant={buttonVariant}
      disabled={disabled}
      {...props}
    >
      <ButtonText size={size} variant={buttonVariant}>
        {label}
      </ButtonText>
    </StyledButton>
  );
});

Button.displayName = "Button";
