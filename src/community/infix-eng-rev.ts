import { AbstractInfixNotation } from "./infix-abstract";
import { toSubscript } from "../utils";

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
}
