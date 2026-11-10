import type { TextareaProps } from "./types";

import { useTextarea } from "./useTextarea";

function Textarea({ rows = 4, ...props }: TextareaProps) {
  const controlProps = useTextarea(props);

  return <textarea {...controlProps} rows={rows} />;
}

export { Textarea };
