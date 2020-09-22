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

/**
 * Transforms 1-digit mantissa decimal into 6-digits mantissa decimal
 * For example: 1.5e10 => 15000e3
 * Note, that it does so in 6 exponent increments, so 1.5e6 is still 1.5e6
 */
export function toLongScale(value: Decimal): Decimal {
  // Give numbers between a thousand and a million exponent 3.
  let mod = value.exponent < 6 ? 3 : 6;
  const exponentOffset = value.exponent % mod;
  return Decimal.fromMantissaExponent_noNormalize(
    value.mantissa * Math.pow(10, exponentOffset),
    value.exponent - exponentOffset
  );
}

export function toFixedEngineering(value: Decimal, places: number): Decimal {
  return fixMantissaOverflow(toEngineering(value), places, 1000, 3);
}

export function toFixedLongScale(value: Decimal, places: number): Decimal {
  let overflowPlaces = value.exponent < 6 ? 3 : 6;
  return fixMantissaOverflow(toLongScale(value), places, Math.pow(10, overflowPlaces), overflowPlaces);
}

const SUBSCRIPT_NUMBERS = ["₀", "₁", "₂", "₃", "₄", "₅", "₆", "₇", "₈", "₉"];

export function toSubscript(value: number): string {
  return value.toFixed(0).split("").map(x => SUBSCRIPT_NUMBERS[parseInt(x)]).join("");
}

const SUPERSCRIPT_NUMBERS = ["⁰", "¹", "²", "³", "⁴", "⁵", "⁶", "⁷", "⁸", "⁹"];

export function toSuperscript(value: number): string {
  return value.toFixed(0).split("").map(x => SUPERSCRIPT_NUMBERS[parseInt(x)]).join("");
}

const STANDARD_ABBREVIATIONS = [
  "K", "M", "B", "T", "Qa", "Qt", "Sx", "Sp", "Oc", "No", "Dc", "UDc", "DDc",
  "TDc", "QaDc", "QtDc", "SxDc", "SpDc", "ODc", "NDc", "Vg", "UVg", "DVg", "TVg",
  "QaVg", "QtVg", "SxVg", "SpVg", "OVg", "NVg", "Tg", "UTg", "DTg", "TTg", "QaTg",
  "QtTg", "SxTg", "SpTg", "OTg", "NTg", "Qd", "UQd", "DQd", "TQd", "QaQd", "QtQd",
  "SxQd", "SpQd", "OQd", "NQd", "Qi", "UQi", "DQi", "TQi", "QaQi", "QtQi", "SxQi",
  "SpQi", "OQi", "NQi", "Se", "USe", "DSe", "TSe", "QaSe", "QtSe", "SxSe", "SpSe",
  "OSe", "NSe", "St", "USt", "DSt", "TSt", "QaSt", "QtSt", "SxSt", "SpSt", "OSt",
  "NSt", "Og", "UOg", "DOg", "TOg", "QaOg", "QtOg", "SxOg", "SpOg", "OOg", "NOg",
  "Nn", "UNn", "DNn", "TNn", "QaNn", "QtNn", "SxNn", "SpNn", "ONn", "NNn", "Ce"
];

const STANDARD_PREFIXES = [
  ["", "U", "D", "T", "Qa", "Qt", "Sx", "Sp", "O", "N"],
  ["", "Dc", "Vg", "Tg", "Qd", "Qi", "Se", "St", "Og", "Nn"],
  ["", "Ce", "Dn", "Tc", "Qe", "Qu", "Sc", "Si", "Oe", "Ne"]
];

const STANDARD_PREFIXES_2 = ["", "MI-", "MC-", "NA-", "PC-", "FM-"];

export function abbreviate(e: number): string {
  // Please, someone clean this code up eventually
  if (e < STANDARD_ABBREVIATIONS.length) {
    return STANDARD_ABBREVIATIONS[e];
  }
  let index2 = 0;
  const prefix = [STANDARD_PREFIXES[0][e % 10]];
  while (e >= 10) {
    e = Math.floor(e / 10);
    prefix.push(STANDARD_PREFIXES[++index2 % 3][e % 10]);
  }
  index2 = Math.floor(index2 / 3);
  while (prefix.length % 3 !== 0) {
    prefix.push("");
  }
  let abbreviation = "";
  while (index2 >= 0) {
    abbreviation += prefix[index2 * 3] + prefix[index2 * 3 + 1] + prefix[index2 * 3 + 2] + STANDARD_PREFIXES_2[index2--];
  }
  abbreviation = abbreviation.replace(/-$/, "");
  return abbreviation
    .replace("UM", "M")
    .replace("UNA", "NA")
    .replace("UPC", "PC")
    .replace("UFM", "FM");
}
