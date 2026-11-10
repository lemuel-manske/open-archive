import type { PropsWithChildren } from "react";

type FormExampleProps = PropsWithChildren<{ onSubmit: () => void }>;

function FormExample({ children, onSubmit }: FormExampleProps) {
  return (
    <form
      aria-label="Example form"
      onSubmit={(event) => {
        event.preventDefault();

        onSubmit();
      }}
    >
      {children}
    </form>
  );
}

export { FormExample };
