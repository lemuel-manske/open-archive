type ClassValue = string | false | null | undefined;

type ClassInput = ClassValue | Readonly<Record<string, boolean | null | undefined>>;

function cx(...inputs: ClassInput[]): string {
  return inputs
    .flatMap((input) => {
      if (!input) return [];

      if (typeof input === "string") return [input];

      return Object.entries(input)
        .filter(([, enabled]) => enabled)
        .map(([className]) => className);
    })
    .join(" ");
}

export { cx, type ClassInput };
