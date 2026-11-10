import type { TextareaProps } from "./types";

import { useTextarea } from "./useTextarea";

function TextareaHook(props: TextareaProps) {
  const control = useTextarea(props);

  return <textarea {...control} />;
}

export { TextareaHook };
