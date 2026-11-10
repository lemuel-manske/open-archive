import type { FormProps } from "./types";

import { useForm } from "./useForm";

function FormHook(props: FormProps) {
  const form = useForm(props);

  return <form {...form} />;
}

export { FormHook };
