/**
 * Country data for countries.js: ISO 3166-1 alpha-2 codes and English
 * names, continents, and EU membership.
 *
 * @module data/countries
 */
/**
 * ISO 3166-1 alpha-2 country codes and names.
 *
 * @type {Readonly<Record<string, string>>}
 */
export declare const countries: Readonly<Record<string, string>>;
/**
 * Country → continent mapping.
 *
 * @type {Readonly<Record<string, string>>}
 */
export declare const continents: Readonly<Record<string, string>>;
/**
 * EU member states.
 *
 * @type {readonly string[]}
 */
export declare const euCountries: readonly string[];
