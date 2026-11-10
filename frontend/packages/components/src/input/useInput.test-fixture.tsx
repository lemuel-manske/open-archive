import type { InputProps } from "./types";

import { useInput } from "./useInput";

function InputHook(props: InputProps) {
  const control = useInput(props);

  return <input {...control} />;
}

export { InputHook };
