import Decimal from "break_infinity.js";

function commaSection(value: string, index: number): string {
  if (index === 0) {
    return value.slice(-3);
  } else {
    return value.slice(-3 * (index + 1), -3 * index);
  }
}

function addCommas(value: string): string {
  return Array.from(Array(Math.ceil(value.length / 3))).map(
    (_, i) => commaSection(value, i)).reverse().join(",");
}

export function formatWithCommas(value: number | string): string {
  const decimalPointSplit = value.toString().split(".");
  decimalPointSplit[0] = decimalPointSplit[0].replace(/\d+$/g, addCommas);
  return decimalPointSplit.join(".");
}

export function formatHigherBaseWithCommas(value: number | string): string {
  const decimalPointSplit = value.toString().split(".");
  decimalPointSplit[0] = decimalPointSplit[0].replace(/[0-9A-Za-z]+$/g, addCommas);
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

export function toSubscript(value: number): string {
  return value.toFixed(0).split("").map(x => SUBSCRIPT_NUMBERS[parseInt(x)]).join("");
}

const SUPERSCRIPT_NUMBERS = ["⁰", "¹", "²", "³", "⁴", "⁵", "⁶", "⁷", "⁸", "⁹"];

export function toSuperscript(value: number): string {
  return value.toFixed(0).split("").map(x => SUPERSCRIPT_NUMBERS[parseInt(x)]).join("");
}
