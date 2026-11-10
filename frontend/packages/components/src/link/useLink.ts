import { cx } from "@openarchive/utils";

import type { LinkProps } from "./types";

import styles from "./Link.module.css";

function useLink({ className, target, rel, ...props }: LinkProps) {
  return {
    ...props,
    target,
    rel:
      target === "_blank"
        ? [...new Set([...(rel?.split(/\s+/) ?? []), "noopener", "noreferrer"])].join(" ")
        : rel,
    className: cx(styles.link, className),
  };
}

export { useLink };
