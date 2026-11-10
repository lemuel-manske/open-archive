import { useCheckbox } from "./useCheckbox";

function CheckboxHook() {
  const checkbox = useCheckbox({
    children: "Subscribe",
    disabled: true,
    "aria-label": "Subscribe",
  });

  return <input {...checkbox.input} />;
}

export { CheckboxHook };
