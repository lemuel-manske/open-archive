import { cx } from "@openarchive/utils";

import { HeadingSize, HeadingWeight } from "./options";

import type { HeadingProps } from "./types";

import styles from "./Heading.module.css";

function useHeading({
  level = 2,
  size = HeadingSize.MEDIUM,
  weight = HeadingWeight.MEDIUM,
  className,
  ...props
}: HeadingProps) {
  return {
    Tag: ({ 1: "h1", 2: "h2", 3: "h3", 4: "h4", 5: "h5", 6: "h6" } as const)[level],
    props: {
      ...props,
      className: cx(styles.heading, className, {
        [styles.small]: size === HeadingSize.SMALL,
        [styles.medium]: size === HeadingSize.MEDIUM,
        [styles.large]: size === HeadingSize.LARGE,
        [styles.regular]: weight === HeadingWeight.REGULAR,
        [styles.mediumWeight]: weight === HeadingWeight.MEDIUM,
        [styles.semibold]: weight === HeadingWeight.SEMIBOLD,
        [styles.bold]: weight === HeadingWeight.BOLD,
      }),
    },
  };
}

export { useHeading };
