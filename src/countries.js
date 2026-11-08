/**
 * Names, emoji flags, continents and EU membership for ISO 3166-1 alpha-2
 * codes. Data in data/countries.js.
 *
 * @module countries
 */

import { continents, countries, euCountries } from './data/countries.js';

/**
 * One country, as `getAll()` lists it.
 *
 * @typedef {{code: string, name: string}} Country
 */

/**
 * What `format` includes besides the name.
 *
 * @typedef {{flag?: boolean, code?: boolean}} FormatOptions
 */

/**
 * Get country name from ISO code.
 * Returns the code itself if not found.
 *
 * @param {string | null | undefined} code - ISO 3166-1 alpha-2 code (e.g. 'US', 'GB').
 * @returns {string} Country name or original code.
 *
 * @example
 * getName('US')  // 'United States'
 * getName('GB')  // 'United Kingdom'
 * getName('XX')  // 'XX'
 */
export function getName(code) {
    if (!code || typeof code !== 'string') return '';
    return countries[code.toUpperCase()] || code.toUpperCase();
}

/**
 * Get emoji flag for a country code.
 *
 * @param {string | null | undefined} code - ISO 3166-1 alpha-2 code.
 * @returns {string} Emoji flag or empty string.
 *
 * @example
 * getFlag('US')  // '🇺🇸'
 * getFlag('GB')  // '🇬🇧'
 */
export function getFlag(code) {
    if (!code || typeof code !== 'string' || code.length !== 2) return '';
    const upper = code.toUpperCase();
    if (!countries[upper]) return '';
    return String.fromCodePoint(
        ...upper.split('').map(c => 0x1F1E6 + c.charCodeAt(0) - 65)
    );
}

/**
 * Format a country for display.
 *
 * @param {string | null | undefined} code - ISO code.
 * @param {FormatOptions} [options] - Include flag and/or code.
 * @returns {string} Formatted string.
 *
 * @example
 * format('US')                                  // 'United States'
 * format('US', { flag: true })                  // '🇺🇸 United States'
 * format('US', { flag: true, code: true })      // '🇺🇸 United States (US)'
 */
export function format(code, options = {}) {
    if (!code || typeof code !== 'string') return '';
    const upper = code.toUpperCase();
    const name = countries[upper];
    if (!name) return upper;

    const parts = [];
    if (options.flag) {
        const flag = getFlag(upper);
        if (flag) parts.push(flag);
    }
    parts.push(name);
    if (options.code) parts.push(`(${upper})`);

    return parts.join(' ');
}

/**
 * Check if a country code is valid.
 *
 * @param {string | null | undefined} code - ISO code to check.
 * @returns {boolean}
 *
 * @example
 * isValid('US')  // true
 * isValid('XX')  // false
 */
export function isValid(code) {
    if (!code || typeof code !== 'string') return false;
    return code.toUpperCase() in countries;
}

/**
 * Get the continent for a country.
 *
 * @param {string | null | undefined} code - ISO country code.
 * @returns {string|null} Continent name or null.
 *
 * @example
 * getContinent('US')  // 'North America'
 * getContinent('JP')  // 'Asia'
 */
export function getContinent(code) {
    if (!code || typeof code !== 'string') return null;
    return continents[code.toUpperCase()] || null;
}

/**
 * Check if a country is in the European Union.
 *
 * @param {string | null | undefined} code - ISO country code.
 * @returns {boolean}
 *
 * @example
 * isEU('DE')  // true
 * isEU('GB')  // false
 */
export function isEU(code) {
    if (!code || typeof code !== 'string') return false;
    return euCountries.includes(code.toUpperCase());
}

/**
 * Get all countries as an array.
 *
 * @returns {Country[]}
 *
 * @example
 * getAll()  // [{ code: 'AF', name: 'Afghanistan' }, ...]
 */
export function getAll() {
    return Object.entries(countries).map(([code, name]) => ({code, name}));
}
