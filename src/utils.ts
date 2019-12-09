import Decimal from "break_infinity.js/break_infinity";

export function formatWithCommas(value: number | string): string {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/gu, ",");
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
  const pow10 = Math.pow(10, places);
  const isOverflowing = Math.round(value.mantissa * pow10) >= threshold * pow10;
  if (isOverflowing) {
    return Decimal.fromMantissaExponent_noNormalize(1, value.exponent + powerOffset);
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
    value.mantissa * Math.pow(10, exponentOffset),
    value.exponent - exponentOffset
  );
}

export function toFixedEngineering(value: Decimal, places: number): Decimal {
  return fixMantissaOverflow(toEngineering(value), places, 1000, 3);
}

const SUBSCRIPT_NUMBERS = ["₀", "₁", "₂", "₃", "₄", "₅", "₆", "₇", "₈", "₉"];

export function toSubscript(num: number): string {
  return num.toFixed(0).split("").map(x => SUBSCRIPT_NUMBERS[parseInt(x)]).join("");
}

const SUPERSCRIPT_NUMBERS = ["⁰", "¹", "²", "³", "⁴", "⁵", "⁶", "⁷", "⁸", "⁹"];

export function toSuperscript(num: number): string {
  return num.toFixed(0).split("").map(x => SUPERSCRIPT_NUMBERS[parseInt(x)]).join("");
}
