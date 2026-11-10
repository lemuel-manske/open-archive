import type { ReactElement, ReactNode } from "react";

interface FieldProps {
  children: ReactNode;

  id?: string;

  disabled?: boolean;

  required?: boolean;

  className?: string;
}

interface FieldPartProps {
  children: ReactNode;

  className?: string;
}

interface FieldControlAttributes {
  id?: string;

  disabled?: boolean;

  required?: boolean;

  "aria-describedby"?: string;

  "aria-invalid"?: boolean;
}

interface FieldControlProps {
  children: ReactElement<FieldControlAttributes>;
}

export type { FieldProps, FieldPartProps, FieldControlProps, FieldControlAttributes };
