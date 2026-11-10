import type { MouseEventHandler, ReactNode, Ref } from "react";

interface LinkProps {
  children: ReactNode;

  href: string;

  target?: "_self" | "_blank" | "_parent" | "_top";

  rel?: string;

  download?: boolean | string;

  id?: string;

  className?: string;

  "aria-label"?: string;

  "aria-current"?: "page" | "step" | "location" | "date" | "time" | boolean;

  onClick?: MouseEventHandler<HTMLAnchorElement>;

  ref?: Ref<HTMLAnchorElement>;
}

export type { LinkProps };
