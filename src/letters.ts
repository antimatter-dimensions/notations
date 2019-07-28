import { EngineeringNotation } from "./engineering";
import Decimal from "break_infinity.js/break_infinity";
import { toEngineering } from "./utils";

const LETTERS = "abcdefghijklmnopqrstuvwxyz";

export class LettersNotation extends EngineeringNotation {
  public get name(): string {
    return "Letters";
  }

  public formatDecimal(value: Decimal, places: number): string {
    const engineering = toEngineering(value);
    const mantissa = engineering.mantissa.toFixed(places);
    return mantissa + this.transcribe(engineering.exponent);
  }

  protected get letters(): string | string[] {
    return LETTERS;
  }

  private transcribe(exponent: number): string {
    // In engineering format, exponent has a step of 3
    // (i.e. the progression looks like this: 1e3 => 10e3 => 100e3 => 1e6 => ...)
    // With this notation we want to convert each step to a letter sequence
    // First, we get a normalizedExponent which is simply e3, e6, e9, ... => 1, 2, 3, ...
    // And next we do a modified base10 to baseN conversion
    // where N is the amount of characters in this notation
    let normalizedExponent = exponent / 3;
    const base = this.letters.length;
    if (normalizedExponent <= base) {
      return this.letters[normalizedExponent - 1];
    }
    let letters = "";
    while (normalizedExponent > base) {
      const remainder = normalizedExponent % base;
      const letterIndex = (remainder === 0 ? base : remainder) - 1;
      letters = this.letters[letterIndex] + letters;
      normalizedExponent = (normalizedExponent - remainder) / base;
      if (remainder === 0) {
        normalizedExponent--;
      }
    }
    letters = this.letters[normalizedExponent - 1] + letters;
    return letters;
  }
}
