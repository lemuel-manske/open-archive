import { Size } from "@openarchive/design-tokens";

const LabelSize = {
  SMALL: Size.SMALL,
  MEDIUM: Size.MEDIUM,
  LARGE: Size.LARGE,
} as const satisfies Pick<typeof Size, "SMALL" | "MEDIUM" | "LARGE">;

type LabelSize = (typeof LabelSize)[keyof typeof LabelSize];

export { LabelSize };
