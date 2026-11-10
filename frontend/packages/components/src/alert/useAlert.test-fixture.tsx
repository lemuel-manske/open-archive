import { useAlert } from "./useAlert";

function AlertHook() {
  const alert = useAlert({ children: "Saved", urgency: "assertive" });

  return <div {...alert} />;
}

export { AlertHook };
