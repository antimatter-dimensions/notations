import { AbstractInfixNotation } from "./infix-abstract";
import { toSubscript } from "../utils";

export class InfixEngineeringNotation extends AbstractInfixNotation {
  public get name(): string {
    return "Infix engineering";
  }

  protected formatMantissa(digit: number): string {
    return digit.toString(10);
  }
  protected formatExponent(exp: number): string {
    return toSubscript(exp);
  }
}
