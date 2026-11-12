/**
 * @arraypress/countries — Test suite.
 * Run: node --test tests/countries.test.js
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { getName, getFlag, format, isValid, getContinent, isEU, getAll } from '../src/index.js';

// ── getName ─────────────────────────────────

describe('getName', () => {
  const cases = [
    ['US', 'United States'], ['GB', 'United Kingdom'], ['DE', 'Germany'],
    ['JP', 'Japan'], ['BR', 'Brazil'], ['AU', 'Australia'], ['FR', 'France'],
    ['CN', 'China'], ['CA', 'Canada'], ['IN', 'India'],
  ];

  for (const [code, expected] of cases) {
    it(`${code} → ${expected}`, () => assert.equal(getName(code), expected));
  }

  it('case insensitive', () => assert.equal(getName('us'), 'United States'));
  it('returns code for unknown', () => assert.equal(getName('XX'), 'XX'));
  it('handles null', () => assert.equal(getName(null), ''));
  it('handles empty', () => assert.equal(getName(''), ''));
});

// ── getFlag ─────────────────────────────────

describe('names, continents and flags that were wrong or missing (1.2.1)', () => {
  it('Palau and Sint Maarten go by their names', () => {
    assert.equal(getName('PW'), 'Palau');
    assert.equal(getName('SX'), 'Sint Maarten');
    assert.equal(getName('MF'), 'Saint Martin (French part)');
    const names = getAll().map(({ name }) => name);
    assert.ok(names.indexOf('Palau') > names.indexOf('Pakistan') && names.indexOf('Palau') < names.indexOf('Panama'));
    assert.ok(names.indexOf('Sint Maarten') > names.indexOf('Singapore') && names.indexOf('Sint Maarten') < names.indexOf('Slovakia'));
  });

  it('every country has a continent', () => {
    for (const { code } of getAll()) assert.ok(getContinent(code), code);
    assert.equal(getContinent('IO'), 'Asia');
    assert.equal(getContinent('CX'), 'Asia');
    assert.equal(getContinent('CC'), 'Asia');
    assert.equal(getContinent('UM'), 'Oceania');
  });

  it('the regions with a currency of their own have flags', () => {
    assert.equal(getFlag('EU'), '🇪🇺');
    assert.equal(getFlag('ea'), '🇪🇦');
    assert.equal(getFlag('IC'), '🇮🇨');
    assert.equal(getFlag('ZZ'), '');
    assert.equal(getFlag('UK'), '');
  });
});

describe('getFlag', () => {
  it('US → 🇺🇸', () => assert.equal(getFlag('US'), '🇺🇸'));
  it('GB → 🇬🇧', () => assert.equal(getFlag('GB'), '🇬🇧'));
  it('JP → 🇯🇵', () => assert.equal(getFlag('JP'), '🇯🇵'));
  it('DE → 🇩🇪', () => assert.equal(getFlag('DE'), '🇩🇪'));
  it('FR → 🇫🇷', () => assert.equal(getFlag('FR'), '🇫🇷'));
  it('case insensitive', () => assert.equal(getFlag('us'), '🇺🇸'));
  it('invalid → empty', () => assert.equal(getFlag('XX'), ''));
  it('null → empty', () => assert.equal(getFlag(null), ''));
  it('single char → empty', () => assert.equal(getFlag('U'), ''));
});

// ── format ──────────────────────────────────

describe('format', () => {
  it('name only', () => assert.equal(format('US'), 'United States'));
  it('with flag', () => assert.equal(format('US', { flag: true }), '🇺🇸 United States'));
  it('with flag and code', () => assert.equal(format('US', { flag: true, code: true }), '🇺🇸 United States (US)'));
  it('with code only', () => assert.equal(format('US', { code: true }), 'United States (US)'));
  it('unknown returns code', () => assert.equal(format('XX'), 'XX'));
  it('case insensitive', () => assert.equal(format('gb', { flag: true }), '🇬🇧 United Kingdom'));
  it('null → empty', () => assert.equal(format(null), ''));
});

// ── isValid ─────────────────────────────────

describe('isValid', () => {
  it('US is valid', () => assert.equal(isValid('US'), true));
  it('GB is valid', () => assert.equal(isValid('GB'), true));
  it('case insensitive', () => assert.equal(isValid('us'), true));
  it('XX is invalid', () => assert.equal(isValid('XX'), false));
  it('empty is invalid', () => assert.equal(isValid(''), false));
  it('null is invalid', () => assert.equal(isValid(null), false));
});

// ── getContinent ────────────────────────────

describe('getContinent', () => {
  const cases = [
    ['US', 'North America'], ['CA', 'North America'], ['MX', 'North America'],
    ['BR', 'South America'], ['AR', 'South America'],
    ['GB', 'Europe'], ['DE', 'Europe'], ['FR', 'Europe'],
    ['JP', 'Asia'], ['CN', 'Asia'], ['IN', 'Asia'],
    ['AU', 'Oceania'], ['NZ', 'Oceania'],
    ['NG', 'Africa'], ['EG', 'Africa'], ['ZA', 'Africa'],
    ['AQ', 'Antarctica'],
  ];

  for (const [code, expected] of cases) {
    it(`${code} → ${expected}`, () => assert.equal(getContinent(code), expected));
  }

  it('case insensitive', () => assert.equal(getContinent('us'), 'North America'));
  it('invalid → null', () => assert.equal(getContinent('XX'), null));
  it('null → null', () => assert.equal(getContinent(null), null));
});

// ── isEU ────────────────────────────────────

describe('isEU', () => {
  const members = ['DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'AT', 'PL', 'SE', 'DK', 'IE', 'FI', 'CZ', 'PT', 'RO', 'HU', 'BG', 'HR', 'SK', 'SI', 'LT', 'LV', 'EE', 'CY', 'MT', 'LU', 'GR'];
  const nonMembers = ['GB', 'US', 'NO', 'CH', 'RU', 'TR', 'JP', 'AU', 'CA'];

  for (const code of members) {
    it(`${code} is EU`, () => assert.equal(isEU(code), true));
  }

  for (const code of nonMembers) {
    it(`${code} is not EU`, () => assert.equal(isEU(code), false));
  }

  it('all 27 members', () => assert.equal(members.filter(c => isEU(c)).length, 27));
  it('case insensitive', () => assert.equal(isEU('de'), true));
  it('null → false', () => assert.equal(isEU(null), false));
});

// ── getAll ──────────────────────────────────

describe('getAll', () => {
  it('returns 249+ countries', () => assert.ok(getAll().length >= 249));
  it('has code and name', () => {
    const first = getAll()[0];
    assert.ok('code' in first);
    assert.ok('name' in first);
  });
  it('includes US', () => assert.ok(getAll().some(c => c.code === 'US' && c.name === 'United States')));
  it('includes GB', () => assert.ok(getAll().some(c => c.code === 'GB' && c.name === 'United Kingdom')));
});
