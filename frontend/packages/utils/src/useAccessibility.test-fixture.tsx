import type { PropsWithChildren } from "react";

import { useAccessibility } from "./useAccessibility";
import type { AccessibilityOptions } from "./useAccessibility";

function AccessibilityButton({ children, ...options }: PropsWithChildren<AccessibilityOptions>) {
  const accessibility = useAccessibility(options);

  return (
    <button {...accessibility} disabled={options.disabled}>
      {children}
    </button>
  );
}

export { AccessibilityButton };
