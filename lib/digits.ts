// JS's \d (without the /u flag and a Unicode property class) only matches
// ASCII 0-9 — typing on an Arabic keyboard's Arabic-Indic numerals (٠-٩)
// was silently stripped by every `.replace(/\D/g, '')` in the numeric
// fields. Normalize to Western digits first so both work.
const ARABIC_INDIC = '٠١٢٣٤٥٦٧٨٩';

export function toWesternDigits(input: string) {
  return input.replace(/[٠-٩]/g, (d) => String(ARABIC_INDIC.indexOf(d)));
}
