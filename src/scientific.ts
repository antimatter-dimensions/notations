import { Notation } from "./notation";
import Decimal from "break_infinity.js/break_infinity";
import { fixMantissaOverflow } from "./utils";

export class ScientificNotation extends Notation {
  public get name(): string {
    return "Scientific";
  }

  public formatDecimal(value: Decimal, places: number): string {
    const fixedValue = fixMantissaOverflow(value, places, 10, 1);
    const mantissa = fixedValue.mantissa.toFixed(places);
    const exponent = this.formatExponent(fixedValue.exponent);
    return `${mantissa}e${exponent}`;
  }
}
