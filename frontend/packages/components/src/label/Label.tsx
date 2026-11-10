import type { LabelProps } from "./types";

import { useLabel } from "./useLabel";

function Label(props: LabelProps) {
  const labelProps = useLabel(props);

  return <label {...labelProps} />;
}

export { Label };
