import { AbstractInfixNotation } from "./infix-abstract";
import { toSubscript, abbreviate } from "../utils";

// Name comes from https://en.wikipedia.org/wiki/Long_and_short_scales
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
