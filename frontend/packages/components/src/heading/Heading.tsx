import type { HeadingProps } from "./types";

import { useHeading } from "./useHeading";

function Heading(props: HeadingProps) {
  const { Tag, props: elementProps } = useHeading(props);

  return <Tag {...elementProps} />;
}

export { Heading };
