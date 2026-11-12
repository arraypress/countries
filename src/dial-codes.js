/**
 * Country calling codes: a region's code ("GB" → "+44"), its trunk prefix
 * (the "0" of "07700 900000"), and the region an international number
 * belongs to ("+44 7700 900000" → GB). Data and sources in
 * data/dial-codes.js.
 *
 * @module dial-codes
 */

import { DIAL_TABLE, NANP_AREA_CODES, REGION_PREFIXES } from './data/dial-codes.js';

/**
 * One region's calling code.
 *
 * @typedef {object} DialCode
 * @property {string} code ISO 3166-1 alpha-2 region code (plus AC and TA).
 * @property {string} dialCode The calling code with its "+": `'+44'`.
 * @property {string} trunkPrefix What the region dials before a national number (`'0'`), or `''`.
 * @property {boolean} main Whether it's the main region of a code several share (GB for +44).
 */

/**
 * What {@link findByDialCode} found.
 *
 * @typedef {object} DialMatch
 * @property {string} code The region: the preferred one if it shares the code,
 *   else the one the area code names (+1 876 is JM), else the code's main region.
 * @property {string} dialCode `'+44'`.
 * @property {string} national The rest of the number, as written (spacing kept), without a "(0)".
 * @property {string[]} codes Every region the number could be in, `code` among them:
 *   one for an unshared code, several for "+44" or "+1 415".
 */

/** @type {readonly DialCode[]} */
const DIAL_CODES = Object.freeze(DIAL_TABLE.trim().split(/[|\n]/).map((entry) => {
  const [code, digits, ...rest] = entry.trim().split(' ');
  return Object.freeze({
    code,
    dialCode: `+${digits}`,
    trunkPrefix: rest.find((part) => /^\d+$/.test(part)) ?? '',
    main: rest.includes('*'),
  });
}).sort((a, b) => a.code.localeCompare(b.code)));

const byCode = new Map(DIAL_CODES.map((entry) => [entry.code, entry]));

/** The longest calling code, in digits: E.164 codes are one to three. */
const LONGEST_CODE = 3;

/**
 * A region's entry, any case.
 *
 * @param {unknown} code - ISO alpha-2 code.
 * @returns {DialCode | undefined}
 */
const entryFor = (code) => (typeof code === 'string' ? byCode.get(code.toUpperCase()) : undefined);

/**
 * A region's calling code.
 *
 * @param {string} code - ISO 3166-1 alpha-2 code, any case.
 * @returns {string} `'+44'`, or `''` for an unknown code.
 *
 * @example
 * getDialCode('GB')  // '+44'
 * getDialCode('jm')  // '+1'
 * getDialCode('XX')  // ''
 */
export function getDialCode(code) {
  return entryFor(code)?.dialCode ?? '';
}

/**
 * The trunk prefix a region dials before a national number: the "0" of
 * "07700 900000", dropped after "+44".
 *
 * @param {string} code - ISO 3166-1 alpha-2 code, any case.
 * @returns {string} `'0'`, `'8'`, `'06'`, … or `''` when it has none (or is unknown).
 *
 * @example
 * getTrunkPrefix('GB')  // '0'
 * getTrunkPrefix('ES')  // ''
 */
export function getTrunkPrefix(code) {
  return entryFor(code)?.trunkPrefix ?? '';
}

/**
 * Every region with a calling code, sorted by region code: the 250 in
 * `getAll()` plus AC and TA.
 *
 * @returns {DialCode[]} A new array.
 */
export function getDialCodes() {
  return [...DIAL_CODES];
}

/**
 * The text after its first `count` digits, keeping the writer's spacing.
 *
 * @param {string} text - The number after "+" or "00".
 * @param {number} count - Digits to skip.
 * @returns {string}
 */
function afterDigits(text, count) {
  let seen = 0;
  for (let i = 0; i < text.length; i++) {
    if (/\d/.test(text[i]) && ++seen === count) return text.slice(i + 1).replace(/^[\s\-.)]+/, '').trim();
  }
  return '';
}

/**
 * The regions a +1 number can be in: the one its area code names, else
 * the members without area codes of their own (the US and Canada).
 *
 * @param {readonly DialCode[]} sharing - Every +1 region.
 * @param {string} rest - The digits after the "1".
 * @returns {DialCode[]}
 */
function nanpRegions(sharing, rest) {
  const area = rest.slice(0, 3);
  const named = sharing.filter(({ code }) => NANP_AREA_CODES[code]?.includes(area));
  return named.length ? named : sharing.filter(({ code }) => !(code in NANP_AREA_CODES));
}

/**
 * The regions of a shared code a number can be in: the ones whose own
 * leading digits it starts with ({@link REGION_PREFIXES}: "+7 701…" is
 * Kazakhstan), else all of them.
 *
 * @param {readonly DialCode[]} sharing - Every region of the code.
 * @param {string} dialCode - The code, e.g. "+7".
 * @param {string} rest - The digits after it.
 * @returns {readonly DialCode[]}
 */
function prefixRegions(sharing, dialCode, rest) {
  const named = Object.entries(REGION_PREFIXES[dialCode] ?? {})
    .filter(([, prefixes]) => prefixes.some((/** @type {string} */ prefix) => rest.startsWith(prefix)))
    .map(([code]) => code);
  const own = sharing.filter(({ code }) => named.includes(code));
  return own.length ? own : sharing;
}

/** An international number as people write it: "tel:" or brackets around the code, an extension after it. */
const INTERNATIONAL = /^\s*(?:tel:)?\s*\(?\s*(?:\+|00)\s*(\d[\d\s\-().]*?)\s*(?:(?:ext\.?|x|#)\s*\d+)?\s*$/i;

/**
 * The region an international number belongs to, and the rest of it.
 * Accepts "+44 7700 900000", "0044 7700 900000", "+44 (0)7700 900000",
 * "(+44) 7700 900000", "tel:+447700900000" and a number with an extension
 * ("+44 20 7946 0958 ext. 12", which `national` leaves out); a number
 * without "+" or "00" isn't international, so it's `null`.
 *
 * Why `codes`: several regions share some codes (+44 is GB, GG, IM and JE),
 * and only the caller knows which it wants; `preferred` picks it when it's
 * among them.
 *
 * @param {string} text - The number as written.
 * @param {string} [preferred] - A region to choose when it shares the code (a Canadian keeps CA for +1).
 * @returns {DialMatch | null} The match, or null when it isn't an international number with a known code.
 *
 * @example
 * findByDialCode('+44 7700 900000')        // { code: 'GB', dialCode: '+44', national: '7700 900000', codes: ['GB', 'GG', 'IM', 'JE'] }
 * findByDialCode('+44 7700 900000', 'JE')  // { code: 'JE', … }
 * findByDialCode('+1 876 555 0100')        // { code: 'JM', dialCode: '+1', national: '876 555 0100', codes: ['JM'] }
 * findByDialCode('+7 701 123 4567')        // { code: 'KZ', dialCode: '+7', national: '701 123 4567', codes: ['KZ'] }
 * findByDialCode('07700 900000')           // null
 */
export function findByDialCode(text, preferred = '') {
  const match = INTERNATIONAL.exec(String(text ?? ''));
  if (!match) return null;
  const digits = match[1].replace(/\D/g, '');
  for (let length = LONGEST_CODE; length >= 1; length--) {
    const dialCode = `+${digits.slice(0, length)}`;
    let sharing = DIAL_CODES.filter((entry) => entry.dialCode === dialCode);
    if (!sharing.length) continue;
    if (dialCode === '+1') sharing = nanpRegions(sharing, digits.slice(1));
    sharing = [...prefixRegions(sharing, dialCode, digits.slice(length))];
    const wanted = String(preferred ?? '').toUpperCase();
    const pick = sharing.find((entry) => entry.code === wanted) ?? sharing.find((entry) => entry.main) ?? sharing[0];
    const national = afterDigits(match[1], length).replace(/^\(0\)\s*/, '').trim();
    return { code: pick.code, dialCode, national, codes: sharing.map((entry) => entry.code) };
  }
  return null;
}
