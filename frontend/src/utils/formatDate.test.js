import { formatDate } from './formatDate';

describe('formatDate utility', () => {
  it('formatta una data ISO in formato italiano', () => {
    expect(formatDate('2025-08-01')).toBe('01/08/2025');
  });

  it('formatta un oggetto Date in formato italiano', () => {
    expect(formatDate(new Date('2024-12-31'))).toBe('31/12/2024');
  });

  it('restituisce stringa vuota per input non valido', () => {
    expect(formatDate('')).toBe('');
    expect(formatDate('data-non-valida')).toBe('');
    expect(formatDate(null)).toBe('');
    expect(formatDate(undefined)).toBe('');
  });
});
