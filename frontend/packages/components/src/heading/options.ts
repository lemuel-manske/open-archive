import { Size, Weight } from "@openarchive/design-tokens";

const HeadingSize = {
  SMALL: Size.SMALL,
  MEDIUM: Size.MEDIUM,
  LARGE: Size.LARGE,
} as const satisfies Pick<typeof Size, "SMALL" | "MEDIUM" | "LARGE">;

type HeadingSize = (typeof HeadingSize)[keyof typeof HeadingSize];

const HeadingWeight = {
  REGULAR: Weight.REGULAR,
  MEDIUM: Weight.MEDIUM,
  SEMIBOLD: Weight.SEMIBOLD,
  BOLD: Weight.BOLD,
} as const satisfies Pick<typeof Weight, "REGULAR" | "MEDIUM" | "SEMIBOLD" | "BOLD">;

type HeadingWeight = (typeof HeadingWeight)[keyof typeof HeadingWeight];

export { HeadingSize, HeadingWeight };
