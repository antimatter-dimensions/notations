
import { AbstractInfixNotation } from "./infix-abstract";

export class InfixEngineeringReverseNotation extends AbstractInfixNotation {
  public get name(): string {
    return "Reverse infix engineering";
  }

  protected formatMantissa(digit: number): string {
    return this.numberToSubscript(digit);
  }
  protected formatExponent(exp: number): string {
    return exp.toString(10);
  }
}
