/**
 * @arraypress/countries
 *
 * Country data utilities — names, flags, continents, EU membership,
 * calling codes and currencies. ISO 3166-1 alpha-2 codes. Designed for ecommerce,
 * analytics, admin UIs and forms.
 *
 * Zero dependencies. Works in any JS runtime.
 *
 * @module @arraypress/countries
 */

export { format, getAll, getContinent, getFlag, getName, isEU, isValid } from './countries.js';
export { getCurrency } from './currencies.js';
export { findByDialCode, getDialCode, getDialCodes, getTrunkPrefix } from './dial-codes.js';
