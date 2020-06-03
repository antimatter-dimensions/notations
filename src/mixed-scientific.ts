import { Notation } from "./notation";
import Decimal from "break_infinity.js/break_infinity";
import { StandardNotation } from "./standard";
import { fixMantissaOverflow } from "./utils";

const standard = new StandardNotation();

export class MixedScientificNotation extends Notation {
  public get name(): string {
    return "Mixed scientific";
  }

  public formatDecimal(value: Decimal, places: number): string {
    if (value.exponent < 33) {
      return standard.formatDecimal(value, places);
    }
    const fixedValue = fixMantissaOverflow(value, places, 10, 1);
    const mantissa = fixedValue.mantissa.toFixed(places);
    const exponent = this.formatExponent(fixedValue.exponent);
    return `${mantissa}e${exponent}`;
  }
}
