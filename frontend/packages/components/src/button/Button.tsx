import type { ButtonProps } from "./types";

import { ButtonLabel } from "./ButtonLabel";

import { useButton } from "./useButton";

function Button(props: ButtonProps) {
  const buttonProps = useButton(props);

  return <button {...buttonProps} />;
}

Button.Label = ButtonLabel;

export { Button };
