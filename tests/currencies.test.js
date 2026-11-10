/**
 * @arraypress/countries — currencies.
 * Run: node --test tests/currencies.test.js
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { getAll, getCurrency } from '../src/index.js';

describe('getCurrency', () => {
  const cases = [
    ['GB', 'GBP'], ['US', 'USD'], ['CA', 'CAD'], ['AU', 'AUD'], ['DE', 'EUR'], ['FR', 'EUR'], ['JP', 'JPY'],
    ['CN', 'CNY'], ['IN', 'INR'], ['BR', 'BRL'], ['PL', 'PLN'], ['SE', 'SEK'], ['NO', 'NOK'], ['DK', 'DKK'],
    ['CH', 'CHF'], ['TH', 'THB'], ['HR', 'EUR'], ['BG', 'EUR'], ['EC', 'USD'], ['GL', 'DKK'], ['EU', 'EUR'],
  ];
  for (const [code, expected] of cases) {
    it(`${code} → ${expected}`, () => assert.equal(getCurrency(code), expected));
  }

  it('case insensitive', () => assert.equal(getCurrency('ca'), 'CAD'));
  it('null for unknown or nothing', () => {
    assert.equal(getCurrency('XX'), null);
    assert.equal(getCurrency(''), null);
    assert.equal(getCurrency(null), null);
  });

  it('every country with people and a currency has one that Intl formats', () => {
    const noCurrency = new Set(['AQ']);
    for (const { code } of getAll()) {
      if (noCurrency.has(code)) continue;
      const currency = getCurrency(code);
      assert.ok(currency, code);
      assert.doesNotThrow(() => new Intl.NumberFormat('en', { style: 'currency', currency }), `${code} ${currency}`);
    }
  });
});
