import { useLink } from "./useLink";

function LinkHook() {
  const link = useLink({
    href: "https://example.com",
    target: "_blank",
    rel: "external",
    children: "Example",
  });

  return <a {...link} />;
}

export { LinkHook };
