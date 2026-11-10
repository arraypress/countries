/**
 * Each region's currency today: the ISO 4217 code its prices are in.
 * Data for currencies.js.
 *
 * Source: Unicode CLDR 49 (cldr-core, supplemental/currencyData.json,
 * https://github.com/unicode-org/cldr-json), Unicode License v3,
 * Copyright © 1991-2026 Unicode, Inc. Extracted Nov 2026: for each region,
 * the first currency that is legal tender and current on 2026-11-10
 * (Bulgaria's is the euro). Regions CLDR lists beside ISO 3166-1 are kept:
 * Ascension (AC), Tristan da Cunha (TA), Kosovo (XK), and the European
 * Union (EU, for the .eu domain).
 *
 * @module data/currencies
 */
/**
 * Region (ISO 3166-1 alpha-2, plus AC, TA, XK, EU) → ISO 4217 code.
 *
 * @type {Readonly<Record<string, string>>}
 */
export declare const currencies: Readonly<Record<string, string>>;
