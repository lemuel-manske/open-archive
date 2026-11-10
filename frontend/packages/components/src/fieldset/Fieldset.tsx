import type { FieldsetProps, LegendProps } from "./types";

import { useFieldset, useLegend } from "./useFieldset";

function Legend(props: LegendProps) {
  const legend = useLegend(props);

  return <legend {...legend} />;
}

function Fieldset(props: FieldsetProps) {
  const fieldset = useFieldset(props);

  return <fieldset {...fieldset} />;
}

Fieldset.Legend = Legend;

export { Fieldset, Legend };
