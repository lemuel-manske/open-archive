import type { LinkProps } from "./types";

import { useLink } from "./useLink";

function Link(props: LinkProps) {
  const link = useLink(props);

  return <a {...link} />;
}

export { Link };
