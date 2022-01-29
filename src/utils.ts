import Decimal from "break_infinity.js";
import { Settings } from "./settings.js";

function commaSection(value: string, index: number): string {
  if (index === 0) {
    return value.slice(-3);
  }
  return value.slice(
    -3 * (index + 1),
    -3 * index
  );
}

function addCommas(value: string): string {
  return Array.from(Array(Math.ceil(value.length / 3))).map((_, i) => commaSection(
    value,
    i
  ))
    .reverse()
    .join(",");
}

export function formatWithCommas(value: number | string): string {
  const decimalPointSplit = value.toString().split(".");
  // Handles higher bases without additional complexity while still removing the decimal point.
  decimalPointSplit[0] = decimalPointSplit[0].replace(
    /\w+$/g,
    addCommas
  );
  return decimalPointSplit.join(".");
}

/**
 * Fixes cases like (9.6e3, 0), which results in "10e3" (but we need "1e4" instead)
 * because toFixed rounds numbers to closest integer
 */
// eslint-disable-next-line max-params
export function fixMantissaOverflow(
  value: Decimal,
  places: number,
  threshold: number,
  powerOffset: number
): Decimal {
  const pow10 = 10 ** places;
  const isOverflowing = Math.round(value.mantissa * pow10) >= threshold * pow10;
  if (isOverflowing) {
    return Decimal.fromMantissaExponent_noNormalize(
      1,
      value.exponent + powerOffset
    );
  }
  return value;
}

/**
 * Transforms 1-digit mantissa decimal into 3-digits mantissa decimal
 * For example: 1.5e5 => 150e3
 * Note, that it does so in 3 exponent increments, so 1.5e3 is still 1.5e3
 */
export function toEngineering(value: Decimal): Decimal {
  const exponentOffset = value.exponent % 3;
  return Decimal.fromMantissaExponent_noNormalize(
    value.mantissa * 10 ** exponentOffset,
    value.exponent - exponentOffset
  );
}

/**
 * Transforms 1-digit mantissa decimal into 6-digits mantissa decimal
 * For example: 1.5e10 => 15000e3
 * Note, that it does so in 6 exponent increments, so 1.5e6 is still 1.5e6
 */
export function toLongScale(value: Decimal): Decimal {
  // Give numbers between a thousand and a million exponent 3.
  const mod = value.exponent < 6 ? 3 : 6;
  const exponentOffset = value.exponent % mod;
  return Decimal.fromMantissaExponent_noNormalize(
    value.mantissa * 10 ** exponentOffset,
    value.exponent - exponentOffset
  );
}

export function toFixedEngineering(value: Decimal, places: number): Decimal {
  return fixMantissaOverflow(
    toEngineering(value),
    places,
    1000,
    3
  );
}

export function toFixedLongScale(value: Decimal, places: number): Decimal {
  const overflowPlaces = value.exponent < 6 ? 3 : 6;
  return fixMantissaOverflow(
    toLongScale(value),
    places,
    10 ** overflowPlaces,
    overflowPlaces
  );
}

const SUBSCRIPT_NUMBERS = ["₀", "₁", "₂", "₃", "₄", "₅", "₆", "₇", "₈", "₉"];

export function toSubscript(value: number): string {
  return value.toFixed(0).split("")
    .map((x) => x === "-" ? "₋" : SUBSCRIPT_NUMBERS[parseInt(x, 10)])
    .join("");
}

const SUPERSCRIPT_NUMBERS = ["⁰", "¹", "²", "³", "⁴", "⁵", "⁶", "⁷", "⁸", "⁹"];

export function toSuperscript(value: number): string {
  return value.toFixed(0).split("")
    .map((x) => x === "-" ? "⁻" : SUPERSCRIPT_NUMBERS[parseInt(x, 10)])
    .join("");
}

const STANDARD_ABBREVIATIONS = [
  "K", "M", "B", "T", "Qa", "Qt", "Sx", "Sp", "Oc", "No"
];

const STANDARD_PREFIXES = [
  ["", "U", "D", "T", "Qa", "Qt", "Sx", "Sp", "O", "N"],
  ["", "Dc", "Vg", "Tg", "Qd", "Qi", "Se", "St", "Og", "Nn"],
  ["", "Ce", "Dn", "Tc", "Qe", "Qu", "Sc", "Si", "Oe", "Ne"]
];

const STANDARD_PREFIXES_2 = ["", "MI-", "MC-", "NA-", "PC-", "FM-", "AT-", "ZP-"];

export function abbreviateStandard(rawExp: number): string {
  const exp = rawExp - 1;
  // This is a special case for zero exponent.
  if (exp === -1) {
    return "";
  }
  // This is a special case for values below Dc, which have special
  // two-letter versions (e.g., Oc instead of O).
  if (exp < STANDARD_ABBREVIATIONS.length) {
    return STANDARD_ABBREVIATIONS[exp];
  }
  let prefix = [];
  let e = exp;
  while (e > 0) {
    prefix.push(STANDARD_PREFIXES[prefix.length % 3][e % 10]);
    e = Math.floor(e / 10);
  }
  while (prefix.length % 3 !== 0) {
    prefix.push("");
  }
  let abbreviation = "";
  for (let i = prefix.length / 3 - 1; i >= 0; i--) {
    abbreviation += prefix.slice(i * 3, i * 3 + 3).join('') + STANDARD_PREFIXES_2[i];
  }
  return abbreviation.replace(/-[A-Z]{2}-/g, "-").replace(/U([A-Z]{2}-)/g, "$1").replace(/-$/, "");
}

// So much of this file is a mess and I'm not sure where's best to add stuff
// (stuff being from a refactoring of scientific and related notations).
export function noSpecialFormatting(exponent: number): boolean {
  return exponent < Settings.exponentCommas.min;
}

export function showCommas(exponent: number): boolean {
  return Settings.exponentCommas.show && exponent < Settings.exponentCommas.max;
}

export function isExponentFullyShown(exponent: number): boolean {
  return noSpecialFormatting(exponent) || showCommas(exponent);
}

// The whole thing where we first format the mantissa, then check if we needed to is from the edge case of
// 9.999e99999 with a 100000 exponent threshold; formatting the mantissa rounds and pushes the exponent
// to the threshold, meaning in some cases that the exponent will have its own exponent and that we don't
// want to show the mantissa.
export function formatMantissaWithExponent(mantissaFormatting: (n: number, precision: number) => string,
exponentFormatting: (n: number, precision: number) => string, base: number, steps: number,
useLogIfExponentIsFormatted: boolean, separator: string = "e", forcePositiveExponent: boolean = false):
((n: Decimal, precision: number) => string) {
  return function (n: Decimal, precision: number): string {
    const realBase = base ** steps;
    let exponent = Math.floor(n.log(realBase)) * steps;
    if (forcePositiveExponent) {
      exponent = Math.max(exponent, 0);
    }
    const mantissa = n.div(Decimal.pow(base, exponent)).toNumber();
    let m = mantissaFormatting(mantissa, precision);
    if (m === mantissaFormatting(realBase, precision)) {
      m = mantissaFormatting(1, precision);
      exponent += steps;
    }
    // This can happen in some cases with a high exponent (either due to high real base or high steps).
    if (exponent === 0) {
      return m;
    }
    const e = exponentFormatting(exponent, precision);
    if (useLogIfExponentIsFormatted && !isExponentFullyShown(exponent)) {
      m = "";
    }
    return `${m}${separator}${e}`;
  };
}

export function formatMantissaBaseTen(n: number, precision: number): string {
  return n.toFixed(precision);
}

export function formatMantissa(base: number, digits: string): ((n: number, precision: number) => string) {
  return function (n: number, precision: number): string {
    let value = Math.round(n * base ** precision);
    const d = [];
    while (value > 0 || d.length === 0) {
      d.push(digits[value % base]);
      value = Math.floor(value / base);
    }
    let result = d.reverse().join("");
    if (precision > 0) {
      result = result.padStart(precision + 1, "0");
      result = `${result.slice(0, -precision)}.${result.slice(-precision)}`;
    }
    return result;
  };
}
