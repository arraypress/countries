/**
 * @arraypress/countries — TypeScript definitions.
 */

export interface Country {
  code: string;
  name: string;
}

export interface FormatOptions {
  flag?: boolean;
  code?: boolean;
}

/** Get country name from ISO code. Returns the code if not found. */
export function getName(code: string): string;

/** Get emoji flag for a country code. */
export function getFlag(code: string): string;

/** Format a country for display with optional flag and code. */
export function format(code: string, options?: FormatOptions): string;

/** Check if a country code is valid. */
export function isValid(code: string): boolean;

/** Get the continent for a country. */
export function getContinent(code: string): string | null;

/** Check if a country is in the EU. */
export function isEU(code: string): boolean;

/** Get all countries. */
export function getAll(): Country[];
