import { Size } from "@openarchive/design-tokens";

const ComboboxSize = {
  SMALL: Size.SMALL,
  MEDIUM: Size.MEDIUM,
  LARGE: Size.LARGE,
} as const satisfies Pick<typeof Size, "SMALL" | "MEDIUM" | "LARGE">;

type ComboboxSize = (typeof ComboboxSize)[keyof typeof ComboboxSize];

enum ComboboxAppearance {
  CUSTOM = "custom",
  NATIVE = "native",
}

export { ComboboxSize, ComboboxAppearance };
