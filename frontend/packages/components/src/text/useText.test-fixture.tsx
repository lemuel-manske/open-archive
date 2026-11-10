import { useText } from "./useText";

function TextHook() {
  const { Tag, props } = useText({ as: "span", children: "Example" });

  return <Tag {...props} />;
}

export { TextHook };
