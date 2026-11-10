import { Size, Variant } from "@openarchive/design-tokens";

const ButtonSize = {
  SMALL: Size.SMALL,
  MEDIUM: Size.MEDIUM,
  LARGE: Size.LARGE,
} as const satisfies Pick<typeof Size, "SMALL" | "MEDIUM" | "LARGE">;

type ButtonSize = (typeof ButtonSize)[keyof typeof ButtonSize];

const ButtonVariant = {
  PRIMARY: Variant.PRIMARY,
  SECONDARY: Variant.SECONDARY,
  TERTIARY: Variant.TERTIARY,
} as const satisfies Pick<typeof Variant, "PRIMARY" | "SECONDARY" | "TERTIARY">;

type ButtonVariant = (typeof ButtonVariant)[keyof typeof ButtonVariant];

export { ButtonSize, ButtonVariant };
