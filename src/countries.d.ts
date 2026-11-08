/**
 * Names, emoji flags, continents and EU membership for ISO 3166-1 alpha-2
 * codes. Data in data/countries.js.
 *
 * @module countries
 */
export type Country = {
    code: string;
    name: string;
};
export type FormatOptions = {
    flag?: boolean;
    code?: boolean;
};
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
export declare function getName(code: string | null | undefined): string;
/**
 * Get emoji flag for a country code. Ascension (AC) and Tristan da Cunha
 * (TA), which `getDialCodes()` lists, have flags too.
 *
 * @param {string | null | undefined} code - ISO 3166-1 alpha-2 code.
 * @returns {string} Emoji flag or empty string.
 *
 * @example
 * getFlag('US')  // '🇺🇸'
 * getFlag('GB')  // '🇬🇧'
 * getFlag('AC')  // '🇦🇨'
 */
export declare function getFlag(code: string | null | undefined): string;
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
export declare function format(code: string | null | undefined, options?: FormatOptions): string;
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
export declare function isValid(code: string | null | undefined): boolean;
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
export declare function getContinent(code: string | null | undefined): string | null;
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
export declare function isEU(code: string | null | undefined): boolean;
/**
 * Get all countries as an array.
 *
 * @returns {Country[]}
 *
 * @example
 * getAll()  // [{ code: 'AF', name: 'Afghanistan' }, ...]
 */
export declare function getAll(): Country[];
