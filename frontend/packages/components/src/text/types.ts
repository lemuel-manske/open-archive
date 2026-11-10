import type { ReactNode } from "react";

import type { TextSize } from "./options";

interface TextProps {
  children: ReactNode;

  as?: "p" | "span";

  size?: TextSize;

  id?: string;

  className?: string;
}

export type { TextProps };
