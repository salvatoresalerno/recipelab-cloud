function parseDate(date: string | Date | null): Date | null {
  if (!date) return null;
  return typeof date === "string" ? new Date(date) : date;
}

/**
 * Formatta data + ora (default ITA), con override opzionale
 * 
 * Esempio d'uso:
 * 
 * - formatDateTime("2025-09-30T14:23:00Z");
 * 👉 "30/09/2025, 16:23"
 * 
 * - formatDateTime("2025-09-30T14:23:00Z", "en-US");
 * 👉 "09/30/2025, 04:23 PM"
 * 
 * - formatDateTime("2025-09-30T14:23:00Z", "de-DE", { second: "2-digit" }); 
 * 👉 30.09.2025, 16:23:00"
 */
export function formatDateTime(date: string | Date | null, locale: string = "it-IT", options: Intl.DateTimeFormatOptions = {}): string {
  const d = parseDate(date);
  if (!d) return "-";

  return d.toLocaleString(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    ...options,
  });
}

/**
 * Formatta solo la data (es: 30/09/2025)(default ITA), con override opzionale
 */
export function formatDate(date: string | Date | null, locale: string = "it-IT", options: Intl.DateTimeFormatOptions = {}): string {
  const d = parseDate(date);
  if (!d) return "-";

  return d.toLocaleDateString(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    ...options
  });
}

/**
 * Formatta solo l’ora (es: 16:23)(default ITA), con override opzionale
 */
export function formatTime(date: string | Date | null, locale: string = "it-IT", options: Intl.DateTimeFormatOptions = {}): string {
  const d = parseDate(date);
  if (!d) return "-";

  return d.toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
    ...options
  });
}

/**
 * Formatta un oggetto Date nel formato 'YYYY-MM-DDTHH:mm' usando l'ora locale.
 * Questo è il formato richiesto per gli input type="datetime-local" per evitare lo sfasamento UTC.
 * @param date - L'oggetto Date da formattare.
 * @returns La data/ora formattata localmente, o una stringa vuota se l'input è undefined.
 */
export const toLocalISOString = (date: Date | undefined): string => {
  if (!date) return '';

  // Funzione helper per aggiungere lo zero iniziale (padding)
  const pad = (number: number): string => (number < 10 ? '0' + number : String(number));

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1); // getMonth è 0-based
  const day = pad(date.getDate());
  const hour = pad(date.getHours());
  const minute = pad(date.getMinutes());

  // Costruisce la stringa 'YYYY-MM-DDTHH:mm'
  return `${year}-${month}-${day}T${hour}:${minute}`;
};


/**
 * Aggiunge dei giorni ad una data.
 *  
 * @param date - L'oggetto Date base.
 * @param days - I giorni da aggiungere.
 * @returns La data con i giorni aggiunti.
 */
export function addDaysToDate(date: Date | null, days: number): Date {
  const baseDate = date ? new Date(date) : new Date();
  baseDate.setDate(baseDate.getDate() + days);

  return baseDate;
}