import { cx } from "@openarchive/utils";

import { TextSize } from "./options";

import type { TextProps } from "./types";

import styles from "./Text.module.css";

function useText({ as = "p", size = TextSize.MEDIUM, className, ...props }: TextProps) {
  return {
    Tag: as,
    props: {
      ...props,
      className: cx(styles.text, className, {
        [styles.small]: size === TextSize.SMALL,
        [styles.medium]: size === TextSize.MEDIUM,
        [styles.large]: size === TextSize.LARGE,
      }),
    },
  };
}

export { useText };
