import { useSpinner } from "./useSpinner";

function SpinnerHook() {
  const spinner = useSpinner({});

  return <span role="status">{spinner.label}</span>;
}

export { SpinnerHook };
