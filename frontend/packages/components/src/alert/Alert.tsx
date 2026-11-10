import type { AlertProps } from "./types";

import { useAlert } from "./useAlert";

function Alert(props: AlertProps) {
  const alert = useAlert(props);

  return <div {...alert} />;
}

export { Alert };
