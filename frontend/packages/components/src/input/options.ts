import { Size } from "@openarchive/design-tokens";

const InputSize = {
  SMALL: Size.SMALL,
  MEDIUM: Size.MEDIUM,
  LARGE: Size.LARGE,
} as const satisfies Pick<typeof Size, "SMALL" | "MEDIUM" | "LARGE">;

type InputSize = (typeof InputSize)[keyof typeof InputSize];

export { InputSize };
