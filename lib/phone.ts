// Jordanian mobile numbers are 9 digits after the country code (7XXXXXXXX).
// Locally people write the same number with a leading trunk "0" (07XXXXXXXX)
// — since the field already shows a fixed +962 badge, that leading 0 is
// redundant, so accept the number whether or not it's typed and normalize
// to the bare 9-digit form everywhere else.
export function normalizeJordanPhone(raw: string) {
  const digits = raw.replace(/\D/g, '');
  return digits.startsWith('0') ? digits.slice(1) : digits;
}

export function isValidJordanPhone(raw: string) {
  return /^7\d{8}$/.test(normalizeJordanPhone(raw));
}
