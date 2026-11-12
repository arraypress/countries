# Changelog

All notable changes to `@arraypress/countries` are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.1] — Unreleased

### Fixed

- Palau is “Palau” (was “Belau”) and SX “Sint Maarten” (was “Saint Martin (Dutch part)”), each in its alphabetical place in `getAll()`.
- `getContinent` knows the British Indian Ocean Territory, Christmas Island and the Cocos Islands (Asia) and the US Minor Outlying Islands (Oceania): every country has a continent.
- `getFlag` gives the flags of the regions `getCurrency` knows beside the countries (EU, EA, IC, DG).
- `findByDialCode` tells regions that share a code by the digits that are theirs alone (`REGION_PREFIXES`, from libphonenumber): “+7 701…” is Kazakhstan (was Russia), “+1 416…” Canada (was the US), “+44 1534…” Jersey, “+39 06698…” the Vatican, “+599 9…” Curaçao, “+262 269…” Mayotte, “+358 18…” Åland, “+47 79…” Svalbard, “+212 5288…” Western Sahara, “+672 1…” Antarctica. A number that starts with none of them keeps every region of its code.
- `findByDialCode` reads “tel:+44…”, “(+44) 20…” and a number with an extension (“ext. 12”, “x204”), which `national` leaves out.

## [1.2.0] — 2026-11-11

### Added

- **Currencies:** `getCurrency(code)` (`'GB'` → `'GBP'`, `'BG'` → `'EUR'`), each region's current currency from Unicode CLDR 49, plus `EU` for the .eu domain. For Better Prices, which reads a shop's currency from its domain.

## [1.1.0] — 2026-11-09

### Added

- **Calling codes:** `getDialCode(code)` (`'GB'` → `'+44'`), `getTrunkPrefix(code)`, `getDialCodes()` and `findByDialCode(text, preferred?)` (`'+44 7700 900000'` → GB and the national number; +1 area codes name the Caribbean and Pacific members). Every country has a code; data from libphonenumber (Apache 2.0) and the ITU, sources in the README. From Tabby's `convert/dial-codes.js`.

### Changed

- `getFlag` also gives Ascension's and Tristan da Cunha's flags (AC, TA), the two phone regions that aren't ISO countries.
- The type declarations are generated from the JSDoc (`npm run types`), and `npm test` also lints, type-checks and checks for copied code.
- Source split into `src/countries.js`, `src/dial-codes.js` and `src/data/`; the public API is unchanged.

## [1.0.0]

- Names, emoji flags, continents, EU membership and `getAll()`.
