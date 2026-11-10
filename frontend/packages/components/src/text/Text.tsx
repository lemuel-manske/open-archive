import type { TextProps } from "./types";

import { useText } from "./useText";

function Text(props: TextProps) {
  const { Tag, props: elementProps } = useText(props);

  return <Tag {...elementProps} />;
}

export { Text };
