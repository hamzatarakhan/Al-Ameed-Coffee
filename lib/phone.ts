// Jordanian mobile numbers: local format is 07X XXX XXXX — 10 digits,
// always starting with "07" (the network-prefix digit follows: 077/078/079).
export function isValidJordanPhone(raw: string) {
  return /^07\d{8}$/.test(raw.replace(/\D/g, ''));
}
