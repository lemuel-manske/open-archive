import { Size } from "@openarchive/design-tokens";

const SpinnerSize = {
  SMALL: Size.SMALL,
  MEDIUM: Size.MEDIUM,
  LARGE: Size.LARGE,
} as const satisfies Pick<typeof Size, "SMALL" | "MEDIUM" | "LARGE">;

type SpinnerSize = (typeof SpinnerSize)[keyof typeof SpinnerSize];

export { SpinnerSize };
