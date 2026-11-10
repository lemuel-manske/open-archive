import { useHeading } from "./useHeading";

function HeadingHook() {
  const { Tag, props } = useHeading({ level: 4, children: "Example" });

  return <Tag {...props} />;
}

export { HeadingHook };
