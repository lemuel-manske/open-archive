import type { ReactNode, Ref } from "react";

interface FieldsetProps {
  children: ReactNode;

  disabled?: boolean;

  name?: string;

  id?: string;

  className?: string;

  "aria-describedby"?: string;

  ref?: Ref<HTMLFieldSetElement>;
}

interface LegendProps {
  children: ReactNode;

  id?: string;

  className?: string;

  ref?: Ref<HTMLLegendElement>;
}

export type { FieldsetProps, LegendProps };
