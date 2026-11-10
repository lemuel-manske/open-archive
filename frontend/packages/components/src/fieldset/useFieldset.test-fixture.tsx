import { useFieldset } from "./useFieldset";

function FieldsetHook() {
  const fieldset = useFieldset({ children: null, disabled: true });

  return (
    <fieldset {...fieldset}>
      <legend>Contact</legend>

      <input aria-label="Email" />
    </fieldset>
  );
}

export { FieldsetHook };
