import type Decimal from "break_infinity.js";
import { AbstractInfixNotation } from "./infix-abstract";
import { toSubscript, abbreviate } from "../utils";

// Name comes from https://en.wikipedia.org/wiki/Long_and_short_scales
export class InfixLongScaleNotation extends AbstractInfixNotation {
  public readonly name = "Infix long scale";

  protected groupDigits = 6;

  protected canHandleZeroExponent = false;

  public formatDecimal(value: Decimal, places: number): string {
    return this.formatInfix(
      value,
      places
    ).replace(
      /[,.]/g,
      (x) => x === "." ? "," : "."
    );
  }

  public formatNegativeDecimal(value: Decimal, places: number): string {
    return `₋${this.formatDecimal(
      value,
      places
    )}`;
  }

  protected formatMantissa(digit: number): string {
    return toSubscript(digit);
  }

  protected formatExponent(exp: number): string {
    if (exp < 0) {
      return (exp / 6).toString();
    }
    return abbreviate(Math.floor(exp / 6));
  }
}
