import { Size } from "@openarchive/design-tokens";

const TextareaSize = {
  SMALL: Size.SMALL,
  MEDIUM: Size.MEDIUM,
  LARGE: Size.LARGE,
} as const satisfies Pick<typeof Size, "SMALL" | "MEDIUM" | "LARGE">;

type TextareaSize = (typeof TextareaSize)[keyof typeof TextareaSize];

export { TextareaSize };
