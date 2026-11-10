import { cloneElement } from "react";

import { cx } from "@openarchive/utils";

import { Label } from "../label/Label";

import type { FieldProps, FieldPartProps, FieldControlProps } from "./types";

import { FieldContext, useField, useFieldContext, useFieldMessage } from "./useField";

import styles from "./Field.module.css";

function FieldLabel(props: FieldPartProps) {
  const { id } = useFieldContext();

  return <Label {...props} htmlFor={id} />;
}

function FieldDescription({ className, ...props }: FieldPartProps) {
  const message = useFieldMessage(false);

  return <p {...props} {...message} className={cx(styles.message, className)} />;
}

function FieldError({ className, ...props }: FieldPartProps) {
  const message = useFieldMessage(true);

  return (
    <p
      {...props}
      {...message}
      role="alert"
      className={cx(styles.message, styles.error, className)}
    />
  );
}

function FieldControl({ children }: FieldControlProps) {
  const field = useFieldContext();

  const describedBy =
    [children.props["aria-describedby"], ...field.descriptions, ...field.errors]
      .filter(Boolean)
      .join(" ") || undefined;

  return cloneElement(children, {
    id: field.id,
    disabled: field.disabled || children.props.disabled,
    required: field.required || children.props.required,
    "aria-invalid": field.errors.length > 0 || children.props["aria-invalid"],
    "aria-describedby": describedBy,
  });
}

function Field({ children, ...props }: FieldProps) {
  const field = useField({ ...props, children });

  return (
    <FieldContext value={field.context}>
      <div className={field.className}>{children}</div>
    </FieldContext>
  );
}

Field.Label = FieldLabel;

Field.Control = FieldControl;

Field.Description = FieldDescription;

Field.Error = FieldError;

export { Field, FieldLabel, FieldControl, FieldDescription, FieldError };
