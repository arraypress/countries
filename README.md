# @arraypress/countries

Country data utilities — names, emoji flags, continents, EU membership and calling codes. Full ISO 3166-1 alpha-2 coverage (250 countries and territories, Kosovo included).

Zero dependencies. Works in Node.js, Cloudflare Workers, Deno, Bun, and browsers.

## Installation

```bash
npm install @arraypress/countries
```

## Usage

```js
import { getName, getFlag, format, isValid, getContinent, isEU, getAll, getDialCode, findByDialCode, getCurrency } from '@arraypress/countries';

// Look up names
getName('US')   // 'United States'
getName('GB')   // 'United Kingdom'

// Emoji flags
getFlag('US')   // '🇺🇸'
getFlag('JP')   // '🇯🇵'

// Formatted display
format('US', { flag: true })               // '🇺🇸 United States'
format('US', { flag: true, code: true })   // '🇺🇸 United States (US)'

// Validation
isValid('US')   // true
isValid('XX')   // false

// Continents
getContinent('US')   // 'North America'
getContinent('JP')   // 'Asia'
getContinent('NG')   // 'Africa'

// EU membership
isEU('DE')   // true
isEU('GB')   // false (post-Brexit)

// All countries (for select dropdowns)
getAll()   // [{ code: 'AF', name: 'Afghanistan' }, ...]

// Calling codes
getDialCode('GB')                   // '+44'
getTrunkPrefix('GB')                // '0' (the "0" of "07700 900000")
findByDialCode('+44 7700 900000')   // { code: 'GB', dialCode: '+44', national: '7700 900000', codes: ['GB', 'GG', 'IM', 'JE'] }
findByDialCode('+1 876 555 0100')   // { code: 'JM', … }: the area code names the island

// Currencies
getCurrency('GB')   // 'GBP'
getCurrency('BG')   // 'EUR' (since January 2026)
getCurrency('EU')   // 'EUR' (for the .eu domain)
```

## API

### `getName(code: string): string`

Returns the country name for an ISO code. Returns the code itself if not found. Case-insensitive.

### `getFlag(code: string): string`

Returns the emoji flag using Unicode regional indicator symbols. Returns empty string for invalid codes.

### `format(code: string, options?: { flag?: boolean, code?: boolean }): string`

Format a country for display. Options control whether to include the emoji flag and/or the ISO code in parentheses.

### `isValid(code: string): boolean`

Check if an ISO code exists in the dataset.

### `getContinent(code: string): string | null`

Returns the continent: `'Africa'`, `'Asia'`, `'Europe'`, `'North America'`, `'South America'`, `'Oceania'`, or `'Antarctica'`.

### `isEU(code: string): boolean`

Check if a country is a current EU member state (27 members post-Brexit).

### `getAll(): Country[]`

Returns all 250 countries as `[{ code, name }]`. Useful for populating select dropdowns.

### `getDialCode(code: string): string`

The country calling code with its "+": `'+44'`. Empty for an unknown code. Every country `getAll()` lists has one.

### `getTrunkPrefix(code: string): string`

What the country dials before a national number (`'0'` in the UK, `'8'` in Russia), dropped after the calling code. Empty where there is none.

### `getDialCodes(): DialCode[]`

Every region with a calling code, sorted: `[{ code, dialCode, trunkPrefix, main }]`. The 250 countries plus Ascension (AC) and Tristan da Cunha (TA), which have codes of their own. `main` marks the main region of a shared code (GB for +44, US for +1).

### `findByDialCode(text: string, preferred?: string): DialMatch | null`

The region an international number belongs to. Accepts `+44 7700 900000`, `0044 7700 900000` and `+44 (0)7700 900000`; a national number gives `null`. Returns `{ code, dialCode, national, codes }`: `national` is the rest as written (without a "(0)"), `codes` every region sharing the code. `code` is `preferred` when it shares the code, else the region a +1 area code names (+1 876 is Jamaica), else the code's main region.

### `getCurrency(code: string): string | null`

The ISO 4217 code a country's prices are in today: `'GBP'`, `'CAD'`. Also `EU` (the euro), AC, TA and XK. `null` for an unknown code (and Antarctica).

## Data sources

Currencies come from the Unicode [CLDR](https://github.com/unicode-org/cldr-json) 49 (`supplemental/currencyData.json`), Unicode License v3, extracted November 2026: each region's first current legal tender.

Calling codes, trunk prefixes and main regions come from Google's [libphonenumber](https://github.com/google/libphonenumber) (`resources/PhoneNumberMetadata.xml`), Apache License 2.0, Copyright (C) 2009 The Libphonenumber Authors, extracted November 2026. Seven ISO regions with no numbering plan of their own in libphonenumber take the ITU code they dial through: AQ +672, BV +47, GS +500, HM +672, PN +64, TF +262, UM +1.

## TypeScript

Full type definitions included.

```ts
import { getName, getAll, isEU } from '@arraypress/countries';
import type { Country, FormatOptions, DialCode, DialMatch } from '@arraypress/countries';
```

## Development

`npm test` runs ESLint, a strict TypeScript check of the JSDoc (the `.d.ts` files are generated from it with `npm run types`, and the check fails while one is stale), the tests, and jscpd.

## License

MIT © 2026 David Sherlock / ArrayPress Limited
