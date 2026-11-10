import { useLegend } from "./useFieldset";

function LegendHook() {
  const legend = useLegend({ children: "Contact" });

  return (
    <fieldset>
      <legend {...legend} />

      <input aria-label="Email" />
    </fieldset>
  );
}

export { LegendHook };
