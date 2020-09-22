import { AbstractInfixNotation } from "./infix-abstract";
import { toSubscript, abbreviate } from "../utils";

export class InfixShortScaleNotation extends AbstractInfixNotation {
  public get name(): string {
    return "Infix short scale";
  }

  protected formatMantissa(digit: number): string {
    return toSubscript(digit);
  }
  protected formatExponent(exp: number): string {
    return abbreviate(exp / 3 - 1);
  }
}
