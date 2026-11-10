import { cx } from "@openarchive/utils";

import type { FieldsetProps, LegendProps } from "./types";

import styles from "./Fieldset.module.css";

function useFieldset({ className, ...props }: FieldsetProps) {
  return { ...props, className: cx(styles.fieldset, className) };
}

function useLegend({ className, ...props }: LegendProps) {
  return { ...props, className: cx(styles.legend, className) };
}

export { useFieldset, useLegend };
