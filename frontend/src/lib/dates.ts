const timeZone = 'America/Sao_Paulo';

function formatDate(value: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'short',
    timeStyle: 'medium',
    timeZone,
  }).format(new Date(value));
}

function formatCalendarDate(value: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone,
  }).format(new Date(value));
}

function formatTime(value: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, { timeStyle: 'medium', timeZone }).format(new Date(value));
}

export { formatCalendarDate, formatDate, formatTime };
