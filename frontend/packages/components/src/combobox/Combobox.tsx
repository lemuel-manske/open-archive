import { ComboboxOption } from "./ComboboxOption";

import type { ComboboxProps } from "./types";

import { useCombobox } from "./useCombobox";

function Combobox(props: ComboboxProps) {
  const comboboxProps = useCombobox(props);

  return <select {...comboboxProps} />;
}

Combobox.Option = ComboboxOption;

export { Combobox };
