import { AbstractInfixNotation } from "./infix-abstract";
import { toSubscript, abbreviate } from "../utils";
import type Decimal from "break_infinity.js";

// Name comes from https://en.wikipedia.org/wiki/Long_and_short_scales
export class InfixShortScaleNotation extends AbstractInfixNotation {
  public readonly name: string = "Infix short scale";

  public formatNegativeDecimal(value: Decimal, places: number): string {
    return `₋${this.formatDecimal(
      value,
      places
    )}`;
  }

  protected canHandleZeroExponent = false;

  protected formatMantissa(digit: number): string {
    return toSubscript(digit);
  }

  protected formatExponent(exp: number): string {
    if (exp < 0) {
      return (exp / 3).toString();
    }
    return abbreviate(exp / 3 - 1);
  }

}
