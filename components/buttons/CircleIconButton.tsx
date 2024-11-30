import { GetProps, Stack, styled, useTheme } from "tamagui";
import { forwardRef } from "react";

// Define size configurations
const SIZE_CONFIGS = {
  small: {
    size: 32,
    iconSize: 16,
  },
  medium: {
    size: 44,
    iconSize: 22,
  },
  large: {
    size: 54,
    iconSize: 28,
  },
} as const;

// Create the styled button component
const StyledCircleIconButton = styled(Stack, {
  name: "CircleIconButton",
  borderRadius: 9999, // Circular shape
  justifyContent: "center",
  alignItems: "center",
  position: "relative",
  overflow: "hidden",

  // Variants
  variants: {
    size: {
      small: {
        width: SIZE_CONFIGS.small.size,
        height: SIZE_CONFIGS.small.size,
      },
      medium: {
        width: SIZE_CONFIGS.medium.size,
        height: SIZE_CONFIGS.medium.size,
      },
      large: {
        width: SIZE_CONFIGS.large.size,
        height: SIZE_CONFIGS.large.size,
      },
    },
    variant: {
      primaryOff: {
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: "$primary",
        pressStyle: {
          backgroundColor: "$primaryTransparent",
          scale: 0.98,
        },
      },
      primaryOn: {
        backgroundColor: "$primary",
        pressStyle: {
          opacity: 0.8,
          scale: 0.98,
        },
      },
      secondaryOff: {
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: "$gray",
        pressStyle: {
          backgroundColor: "$grayTransparent",
          scale: 0.98,
        },
      },
      secondaryOn: {
        backgroundColor: "$gray",
        pressStyle: {
          opacity: 0.8,
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
    variant: "primaryOff",
  },
});

// Props type
type CircleIconButtonProps = GetProps<typeof StyledCircleIconButton> & {
  icon: React.FC<{ size?: number; color?: string }>;
  iconSize?: number;
};

// Main button component
export const CircleIconButton = forwardRef<
  React.ElementRef<typeof StyledCircleIconButton>,
  CircleIconButtonProps
>(({ icon: Icon, size, variant, disabled, iconSize, ...props }, ref) => {
  const theme = useTheme();
  const buttonVariant = disabled ? "disabled" : variant;
  const setIconSize = iconSize || SIZE_CONFIGS[size || "medium"].iconSize;

  const getIconColor = () => {
    if (disabled) return theme.gray.val;
    switch (variant) {
      case "primaryOn":
        return theme.bg.val;
      case "primaryOff":
        return theme.primary.val;
      case "secondaryOn":
        return theme.bg.val;
      case "secondaryOff":
        return theme.gray.val;
      default:
        return theme.primary.val;
    }
  };
  return (
    <StyledCircleIconButton
      ref={ref}
      size={size}
      variant={buttonVariant}
      disabled={disabled}
      {...props}
    >
      <Icon size={setIconSize} color={getIconColor()} />
    </StyledCircleIconButton>
  );
});

CircleIconButton.displayName = "CircleIconButton";
