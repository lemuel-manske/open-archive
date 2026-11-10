import type { ReactNode } from "react";

import type { HeadingSize, HeadingWeight } from "./options";

interface HeadingProps {
  children: ReactNode;

  level?: 1 | 2 | 3 | 4 | 5 | 6;

  size?: HeadingSize;

  weight?: HeadingWeight;

  id?: string;

  className?: string;
}

export type { HeadingProps };
