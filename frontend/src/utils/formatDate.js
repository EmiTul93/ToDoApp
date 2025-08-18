/**
 * Formatta una data in una stringa italiana (gg/mm/aaaa).
 * Se la data non è valida o assente, restituisce stringa vuota.
 * @param {string|Date} dateValue - Stringa ISO o oggetto Date
 * @returns {string}
 */
export function formatDate(dateValue) {
  if (!dateValue) return '';
  const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
  if (isNaN(date)) return '';
  return date.toLocaleDateString('it-IT');
}
