import { Notation } from "./notation";
import Decimal from "break_infinity.js";

const ROMAN_NUMBERS: [number, string][] = [
  [1000000, "M̄"],
  [900000, "C̄M̄"],
  [500000, "D̄"],
  [400000, "C̄D̄"],
  [100000, "C̄"],
  [90000, "X̄C̄"],
  [50000, "L̄"],
  [40000, "X̄L̄"],
  [10000, "X̄"],
  [9000, "ⅯX̄"],
  [5000, "V̄"],
  [4000, "ⅯV̄"],
  [1000, "Ⅿ"],
  [900, "ⅭⅯ"],
  [500, "Ⅾ"],
  [400, "ⅭⅮ"],
  [100, "Ⅽ"],
  [90, "ⅩⅭ"],
  [50, "Ⅼ"],
  [40, "ⅩⅬ"],
  [10, "Ⅹ"],
  [9, "ⅠⅩ"],
  [5, "Ⅴ"],
  [4, "ⅠⅤ"],
  [1, "Ⅰ"]
];
const ROMAN_FRACTIONS = ["", "·", ":", "∴", "∷", "⁙"];
const MAXIMUM = 4000000;
const MAX_LOG_10 = Math.log10(MAXIMUM);

export class RomanNotation extends Notation {
  public get name(): string {
    return "Roman";
  }

  public get infinite(): string {
    return "Infinitus";
  }

  public formatUnder1000(value: number): string {
    return this.romanize(value);
  }

  public formatDecimal(value: Decimal): string {
    if (value.lt(MAXIMUM)) {
      return this.romanize(value.toNumber());
    }
    const log10 = value.log10();
    const maximums = log10 / MAX_LOG_10;
    const current = Math.pow(MAXIMUM, maximums - Math.floor(maximums));
    return `${this.romanize(current)}↑${this.formatDecimal(new Decimal(maximums))}`;
  }

  private romanize(value: number): string {
    let romanized = "";
    for (const numberPair of ROMAN_NUMBERS) {
      const decimal = numberPair[0];
      const roman = numberPair[1];
      while (decimal <= value) {
        romanized += roman;
        value -= decimal;
      }
    }
    let duodecimal = Math.round(Math.floor(value * 10) * 1.2);
    if (duodecimal === 0) {
      return romanized === "" ? "nulla" : romanized;
    }
    if (duodecimal > 5) {
      duodecimal -= 6;
      romanized += "Ｓ";
    }
    romanized += ROMAN_FRACTIONS[duodecimal];
    return romanized;
  }
}
