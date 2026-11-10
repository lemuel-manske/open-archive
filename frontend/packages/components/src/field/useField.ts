import { createContext, useCallback, useContext, useEffect, useState } from "react";

import { cx, useAccessibility } from "@openarchive/utils";

import type { FieldProps } from "./types";

import styles from "./Field.module.css";

interface FieldContextValue {
  id: string;

  disabled?: boolean;

  required?: boolean;

  descriptions: string[];

  errors: string[];

  register: (id: string, error: boolean) => () => void;
}

const FieldContext = createContext<FieldContextValue | null>(null);

function useField({ id, disabled, required, className }: FieldProps) {
  const accessibility = useAccessibility({ id });

  const [descriptions, setDescriptions] = useState<string[]>([]);

  const [errors, setErrors] = useState<string[]>([]);

  const register = useCallback((messageId: string, error: boolean) => {
    const setMessages = error ? setErrors : setDescriptions;

    setMessages((messages) => [...messages, messageId]);

    return () => setMessages((messages) => messages.filter((item) => item !== messageId));
  }, []);

  return {
    context: { id: accessibility.id, disabled, required, descriptions, errors, register },
    className: cx(styles.field, className),
  };
}

function useFieldContext() {
  const context = useContext(FieldContext);

  if (!context) {
    throw new Error("Field parts must be rendered inside Field.");
  }

  return context;
}

function useFieldMessage(error: boolean) {
  const { register } = useFieldContext();

  const { id } = useAccessibility();

  useEffect(() => register(id, error), [id, error, register]);

  return { id };
}

export { FieldContext, useField, useFieldContext, useFieldMessage };
