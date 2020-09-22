
const SUBSCRIPT_DIGITS = new Map(Object.entries({
  "0": "₀",
  "1": "₁",
  "2": "₂",
  "3": "₃",
  "4": "₄",
  "5": "₅",
  "6": "₆",
  "7": "₇",
  "8": "₈",
  "9": "₉",
  "-": "₋"
}));


import { Notation } from "./notation";
import Decimal from "break_infinity.js";

export abstract class AbstractInfixNotation extends Notation {
  public get name(): string {
    return "Abstract Infix";
  }

  public formatDecimal(value: Decimal, places: number): string {
    const p = Math.max(places, this.groupDigits-1);
//     const offset = value.exponent % this.groupDigits;
//     let exp = value.exponent - offset;
    let exp = value.exponent;
//     let mant = value.mantissa * Math.pow(10, offset);
    let mant = value.mantissa;

    let str = "";
    // Loop through digits, from first to next-to-last
    for (let minExp = exp - p; exp > minExp; exp--) {
      const digit = Math.trunc(mant);
      str += this.formatMantissa(digit);

      // Output a separator on each group
      if (!(exp % this.groupDigits))  {
        str += this.formatExponent(exp);
      }
      mant = (mant - digit) * 10;
    }

    // Output last digit
    str += this.formatMantissa(Math.round(mant));

    // Only output separator at the end if it's the only one
    if (p <= this.groupDigits && !(exp % this.groupDigits))  {
      str += this.formatExponent(exp);
    }

    return str;
  }

  // Formats a small number into a subscript string
  // Technically speaking, returns a string containing unicode sequences, each sequence
  // representing one subscript digit of the given number, interpreted as base 10.
  // "small" number means "smaller than the IEEE 754 mantissa limit", i.e. "smaller than 2^24"
  protected numberToSubscript(n: number): string {
    return n.toString(10).split("").map((d) => SUBSCRIPT_DIGITS.get(d)).join("");
  }

  protected abstract formatMantissa(digit: number): string;
  protected abstract formatExponent(digit: number): string;

  private groupDigits: number = 3
}
