import { Size } from "@openarchive/design-tokens";

const TextSize = {
  SMALL: Size.SMALL,
  MEDIUM: Size.MEDIUM,
  LARGE: Size.LARGE,
} as const satisfies Pick<typeof Size, "SMALL" | "MEDIUM" | "LARGE">;

type TextSize = (typeof TextSize)[keyof typeof TextSize];

export { TextSize };
