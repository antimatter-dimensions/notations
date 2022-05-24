import type Decimal from "break_infinity.js";
import { AbstractInfixNotation } from "./infix-abstract";
import { toSubscript } from "../utils";

export class InfixEngineeringReverseNotation extends AbstractInfixNotation {
  public readonly name: string = "Reverse infix engineering";

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
    return exp.toString(10);
  }
}
