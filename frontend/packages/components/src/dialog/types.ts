import type { ReactNode } from "react";

interface DialogProps {
  children: ReactNode;

  title: string;

  open: boolean;

  onOpenChange: (open: boolean) => void;

  closeLabel?: string;

  className?: string;
}

export type { DialogProps };
