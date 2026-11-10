import type { ButtonProps } from "./types";

import { useButton } from "./useButton";

function ButtonHook(props: ButtonProps) {
  const button = useButton(props);

  return <button {...button} />;
}

export { ButtonHook };
