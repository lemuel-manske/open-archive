import type { ReactNode } from "react";

interface AlertProps {
  children: ReactNode;

  urgency?: "polite" | "assertive";

  className?: string;

  id?: string;
}

export type { AlertProps };
