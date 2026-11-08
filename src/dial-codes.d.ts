/**
 * Country calling codes: a region's code ("GB" → "+44"), its trunk prefix
 * (the "0" of "07700 900000"), and the region an international number
 * belongs to ("+44 7700 900000" → GB). Data and sources in
 * data/dial-codes.js.
 *
 * @module dial-codes
 */
export type DialCode = {
    /**
     * ISO 3166-1 alpha-2 region code (plus AC and TA).
     */
    code: string;
    /**
     * The calling code with its "+": `'+44'`.
     */
    dialCode: string;
    /**
     * What the region dials before a national number (`'0'`), or `''`.
     */
    trunkPrefix: string;
    /**
     * Whether it's the main region of a code several share (GB for +44).
     */
    main: boolean;
};
export type DialMatch = {
    /**
     * The region: the preferred one if it shares the code,
     * else the one the area code names (+1 876 is JM), else the code's main region.
     */
    code: string;
    /**
     * `'+44'`.
     */
    dialCode: string;
    /**
     * The rest of the number, as written (spacing kept), without a "(0)".
     */
    national: string;
    /**
     * Every region the number could be in, `code` among them:
     * one for an unshared code, several for "+44" or "+1 415".
     */
    codes: string[];
};
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
export declare function getDialCode(code: string): string;
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
export declare function getTrunkPrefix(code: string): string;
/**
 * Every region with a calling code, sorted by region code: the 250 in
 * `getAll()` plus AC and TA.
 *
 * @returns {DialCode[]} A new array.
 */
export declare function getDialCodes(): DialCode[];
/**
 * The region an international number belongs to, and the rest of it.
 * Accepts "+44 7700 900000", "0044 7700 900000" and "+44 (0)7700 900000";
 * a number without "+" or "00" isn't international, so it's `null`.
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
 * findByDialCode('07700 900000')           // null
 */
export declare function findByDialCode(text: string, preferred?: string): DialMatch | null;
