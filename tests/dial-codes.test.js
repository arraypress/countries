/**
 * @arraypress/countries — calling codes.
 * Run: node --test tests/dial-codes.test.js
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { findByDialCode, getAll, getDialCode, getDialCodes, getFlag, getTrunkPrefix } from '../src/index.js';

describe('getDialCode', () => {
  const cases = [['GB', '+44'], ['US', '+1'], ['JM', '+1'], ['DE', '+49'], ['IN', '+91'], ['AQ', '+672'], ['XK', '+383'], ['AC', '+247']];
  for (const [code, expected] of cases) it(`${code} → ${expected}`, () => assert.equal(getDialCode(code), expected));

  it('case insensitive', () => assert.equal(getDialCode('gb'), '+44'));
  it('empty for unknown, null or empty', () => {
    assert.equal(getDialCode('XX'), '');
    assert.equal(getDialCode(/** @type {any} */ (null)), '');
    assert.equal(getDialCode(''), '');
  });

  it('every country getAll() lists has one', () => {
    const missing = getAll().filter(({ code }) => !getDialCode(code)).map(({ code }) => code);
    assert.deepEqual(missing, []);
  });
});

describe('getTrunkPrefix', () => {
  it('the national prefix dialled before a local number', () => {
    assert.equal(getTrunkPrefix('GB'), '0');
    assert.equal(getTrunkPrefix('RU'), '8');
    assert.equal(getTrunkPrefix('HU'), '06');
    assert.equal(getTrunkPrefix('US'), '1');
  });
  it('empty where there is none, or for an unknown code', () => {
    assert.equal(getTrunkPrefix('ES'), '');
    assert.equal(getTrunkPrefix('XX'), '');
  });
});

describe('getDialCodes', () => {
  it('every country plus Ascension and Tristan da Cunha, sorted, one main region per shared code', () => {
    const list = getDialCodes();
    assert.equal(list.length, getAll().length + 2);
    assert.deepEqual(list.map((entry) => entry.code), [...list.map((entry) => entry.code)].sort());
    assert.deepEqual(list.find((entry) => entry.code === 'GB'), { code: 'GB', dialCode: '+44', trunkPrefix: '0', main: true });
    const shared = Object.groupBy(list, (entry) => entry.dialCode);
    for (const [dialCode, entries = []] of Object.entries(shared)) {
      if (entries.length > 1) assert.equal(entries.filter((entry) => entry.main).length, 1, dialCode);
    }
  });

  it('every region listed has a flag, Ascension and Tristan da Cunha included', () => {
    assert.deepEqual(getDialCodes().filter(({ code }) => !getFlag(code)), []);
    assert.equal(getFlag('AC'), '🇦🇨');
  });

  it('is a copy', () => {
    getDialCodes().pop();
    assert.equal(getDialCodes().length, getAll().length + 2);
  });
});

describe('findByDialCode', () => {
  it('+44 is the UK, the rest of the number kept as written', () => {
    assert.deepEqual(findByDialCode('+44 7700 900000'), { code: 'GB', dialCode: '+44', national: '7700 900000', codes: ['GB', 'GG', 'IM', 'JE'] });
  });

  it('00 works as +, and a "(0)" after the code is dropped', () => {
    assert.equal(findByDialCode('0044 7700 900000')?.national, '7700 900000');
    assert.equal(findByDialCode('+44 (0)7700 900000')?.national, '7700 900000');
  });

  it('a preferred region that shares the code wins; one that doesn’t is ignored', () => {
    assert.equal(findByDialCode('+44 1534 000000', 'je')?.code, 'JE');
    assert.equal(findByDialCode('+44 7700 900000', 'FR')?.code, 'GB');
  });

  it('three-digit codes before shorter ones', () => {
    assert.deepEqual(findByDialCode('+353 1 234 5678'), { code: 'IE', dialCode: '+353', national: '1 234 5678', codes: ['IE'] });
    assert.equal(findByDialCode('+7 912 345 67 89')?.code, 'RU');
  });

  it('+1: the area code names a Caribbean or Pacific member; otherwise the US, or Canada if preferred', () => {
    assert.deepEqual(findByDialCode('+1 876 555 0100'), { code: 'JM', dialCode: '+1', national: '876 555 0100', codes: ['JM'] });
    assert.equal(findByDialCode('+1 (809) 555-0100')?.code, 'DO');
    assert.deepEqual(findByDialCode('+1 415 555 0100'), { code: 'US', dialCode: '+1', national: '415 555 0100', codes: ['CA', 'UM', 'US'] });
    // An area code neither table names stays the US's or Canada's to choose.
    assert.equal(findByDialCode('+1 415 555 0100', 'CA')?.code, 'CA');
  });

  it('a shared code with no main region of its own picks the marked one', () => {
    assert.equal(findByDialCode('+672 3 12345')?.code, 'NF');
    assert.equal(findByDialCode('+64 21 123 4567')?.code, 'NZ');
  });

  it('a region with leading digits of its own is told from the ones it shares a code with', () => {
    /** @type {[string, string, string[]][]} */
    const cases = [
      ['+7 701 123 4567', 'KZ', ['KZ']],
      ['+7 6012 34 56 78', 'KZ', ['KZ']],
      ['+7 495 123 4567', 'RU', ['KZ', 'RU']],
      ['+1 416 555 0100', 'CA', ['CA']],
      ['+1 (604) 555-0100', 'CA', ['CA']],
      ['+1 867 555 0100', 'CA', ['CA']],
      ['+1 212 555 0100', 'US', ['CA', 'UM', 'US']],
      ['+44 1534 123456', 'JE', ['JE']],
      ['+44 1481 123456', 'GG', ['GG']],
      ['+44 1624 123456', 'IM', ['IM']],
      ['+44 20 7946 0958', 'GB', ['GB', 'GG', 'IM', 'JE']],
      ['+39 06 6988 1234', 'VA', ['VA']],
      ['+39 06 1234 5678', 'IT', ['IT', 'VA']],
      ['+599 9 123 4567', 'CW', ['CW']],
      ['+599 717 1234', 'BQ', ['BQ']],
      ['+262 269 60 12 34', 'YT', ['YT']],
      ['+262 262 12 34 56', 'RE', ['RE', 'TF', 'YT']],
      ['+358 18 12345', 'AX', ['AX']],
      ['+47 79 02 12 34', 'SJ', ['SJ']],
      ['+212 5288 12345', 'EH', ['EH']],
      ['+672 1 12345', 'AQ', ['AQ']],
    ];
    for (const [number, code, codes] of cases) {
      const found = findByDialCode(number);
      assert.equal(found?.code, code, number);
      assert.deepEqual(found?.codes, codes, number);
    }
    // A preference among the regions left still wins; one ruled out doesn't.
    assert.equal(findByDialCode('+7 495 123 4567', 'KZ')?.code, 'KZ');
    assert.equal(findByDialCode('+7 701 123 4567', 'RU')?.code, 'KZ');
  });

  it('reads a number as links and people write it: tel:, brackets round the code, an extension', () => {
    assert.deepEqual(findByDialCode('tel:+442079460958'), { code: 'GB', dialCode: '+44', national: '2079460958', codes: ['GB', 'GG', 'IM', 'JE'] });
    assert.equal(findByDialCode('(+44) 20 7946 0958')?.national, '20 7946 0958');
    assert.equal(findByDialCode('+44 20 7946 0958 ext. 12')?.national, '20 7946 0958');
    assert.equal(findByDialCode('+1 415 555 0100 x204')?.national, '415 555 0100');
    assert.equal(findByDialCode('+44 20 7946 0958 extra'), null);
  });

  it('null for a national number, junk, or an unknown code', () => {
    assert.equal(findByDialCode('07700 900000'), null);
    assert.equal(findByDialCode('+44 call me'), null);
    assert.equal(findByDialCode(''), null);
    assert.equal(findByDialCode('+999 123'), null);
  });
});
