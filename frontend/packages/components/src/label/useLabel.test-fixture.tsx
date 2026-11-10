import type { LabelProps } from "./types";

import { useLabel } from "./useLabel";

function LabelHook(props: LabelProps) {
  const label = useLabel(props);

  return <label {...label} />;
}

export { LabelHook };
