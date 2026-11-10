import type { ComboboxProps } from "./types";

import { useCombobox } from "./useCombobox";

function ComboboxHook(props: ComboboxProps) {
  const combobox = useCombobox(props);

  return <select {...combobox} />;
}

export { ComboboxHook };
