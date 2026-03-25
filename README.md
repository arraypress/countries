# @arraypress/countries

Country data utilities — names, emoji flags, continents, and EU membership. Full ISO 3166-1 alpha-2 coverage (249 countries and territories).

Zero dependencies. Works in Node.js, Cloudflare Workers, Deno, Bun, and browsers.

## Installation

```bash
npm install @arraypress/countries
```

## Usage

```js
import { getName, getFlag, format, isValid, getContinent, isEU, getAll } from '@arraypress/countries';

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

Returns all 249 countries as `[{ code, name }]`. Useful for populating select dropdowns.

## TypeScript

Full type definitions included.

```ts
import { getName, getAll, isEU } from '@arraypress/countries';
import type { Country, FormatOptions } from '@arraypress/countries';
```

## License

MIT
