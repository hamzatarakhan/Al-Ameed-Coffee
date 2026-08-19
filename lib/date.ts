// Shared by DateInput (the picker's own display) and the profile view row —
// dates are stored as ISO 'YYYY-MM-DD' but always shown as DD/MM/YYYY.
export function formatDateDisplay(iso: string) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}
