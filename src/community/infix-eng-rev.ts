import { AbstractInfixNotation } from "./infix-abstract";
import { toSubscript } from "../utils";
import Decimal from "break_infinity.js";

export class InfixEngineeringReverseNotation extends AbstractInfixNotation {
  public get name(): string {
    return "Reverse infix engineering";
  }

  protected formatMantissa(digit: number): string {
    return toSubscript(digit);
  }
  protected formatExponent(exp: number): string {
    return exp.toString(10);
  }
  public formatNegativeDecimal(value: Decimal, places: number): string {
    return `₋${this.formatDecimal(value, places)}`;
  }
}
