const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "medium",
  timeZone: "America/Sao_Paulo",
});

function formatDate(value: string): string {
  return dateFormatter.format(new Date(value));
}

export { formatDate };
