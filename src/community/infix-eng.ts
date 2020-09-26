import { AbstractInfixNotation } from "./infix-abstract";
import { toSubscript } from "../utils";

export class InfixEngineeringNotation extends AbstractInfixNotation {
  public readonly name: string = "Infix engineering";

  protected formatMantissa(digit: number): string {
    return digit.toString(10);
  }

  protected formatExponent(exp: number): string {
    return toSubscript(exp);
  }
}
