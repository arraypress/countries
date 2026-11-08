# Changelog

All notable changes to `@arraypress/countries` are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] — 2026-11-09

### Added

- **Calling codes:** `getDialCode(code)` (`'GB'` → `'+44'`), `getTrunkPrefix(code)`, `getDialCodes()` and `findByDialCode(text, preferred?)` (`'+44 7700 900000'` → GB and the national number; +1 area codes name the Caribbean and Pacific members). Every country has a code; data from libphonenumber (Apache 2.0) and the ITU, sources in the README. From Tabby's `convert/dial-codes.js`.

### Changed

- `getFlag` also gives Ascension's and Tristan da Cunha's flags (AC, TA), the two phone regions that aren't ISO countries.
- The type declarations are generated from the JSDoc (`npm run types`), and `npm test` also lints, type-checks and checks for copied code.
- Source split into `src/countries.js`, `src/dial-codes.js` and `src/data/`; the public API is unchanged.

## [1.0.0]

- Names, emoji flags, continents, EU membership and `getAll()`.
