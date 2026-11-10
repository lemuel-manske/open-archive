import type { FormEventHandler, ReactNode, Ref } from "react";

interface FormProps {
  children: ReactNode;

  id?: string;

  className?: string;

  "aria-label"?: string;

  "aria-labelledby"?: string;

  action?: string;

  method?: "get" | "post";

  autoComplete?: "on" | "off";

  noValidate?: boolean;

  onSubmit?: FormEventHandler<HTMLFormElement>;

  onReset?: FormEventHandler<HTMLFormElement>;

  ref?: Ref<HTMLFormElement>;
}

export type { FormProps };
