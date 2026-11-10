import type { ReactNode, Ref } from "react";

import type { LabelSize } from "./options";

interface LabelProps {
  children: ReactNode;

  size?: LabelSize;

  id?: string;

  htmlFor?: string;

  className?: string;

  ref?: Ref<HTMLLabelElement>;
}

export type { LabelProps };
