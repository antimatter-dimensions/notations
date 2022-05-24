import type Decimal from "break_infinity.js";
import { AbstractInfixNotation } from "./infix-abstract";
import { toSubscript, abbreviateStandard } from "../utils";

// Name comes from https://en.wikipedia.org/wiki/Long_and_short_scales
export class InfixShortScaleNotation extends AbstractInfixNotation {
  public readonly name: string = "Infix short scale";

  protected canHandleZeroExponent = false;

  public formatNegativeDecimal(value: Decimal, places: number, placesExponent: number): string {
    return `₋${this.formatDecimal(
      value,
      places,
      placesExponent
    )}`;
  }

  protected formatMantissa(digit: number): string {
    return toSubscript(digit);
  }

  protected formatExponent(exp: number): string {
    if (exp < 0) {
      return (exp / 3).toString();
    }
    return abbreviateStandard(exp / 3);
  }
}
