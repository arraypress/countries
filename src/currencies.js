/**
 * The currency each country's prices are in. Data in data/currencies.js.
 *
 * @module currencies
 */

import { currencies } from './data/currencies.js';

/**
 * Get the currency a country's prices are in today.
 *
 * @param {string | null | undefined} code - ISO 3166-1 alpha-2 code (any case); also EU (the
 *   euro), AC, TA and XK.
 * @returns {string | null} Its ISO 4217 code, or null for an unknown region.
 *
 * @example
 * getCurrency('GB')  // 'GBP'
 * getCurrency('ca')  // 'CAD'
 * getCurrency('BG')  // 'EUR' (since January 2026)
 * getCurrency('XX')  // null
 */
export function getCurrency(code) {
    if (!code || typeof code !== 'string') return null;
    return currencies[code.toUpperCase()] ?? null;
}
