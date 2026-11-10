import type { InputProps } from "./types";

import { useInput } from "./useInput";

function Input({ type = "text", ...props }: InputProps) {
  const controlProps = useInput(props);

  return <input {...controlProps} type={type} />;
}

export { Input };
