import type Decimal from "break_infinity.js";
import { Notation } from "./notation";
import { StandardNotation } from "./standard";
import { formatMantissaWithExponent, formatMantissaBaseTen } from "./utils";

const standard = new StandardNotation();

export class MixedScientificNotation extends Notation {
  public get name(): string {
    return "Mixed scientific";
  }

  public formatDecimal(value: Decimal, places: number, placesExponent: number): string {
    if (value.exponent < 33) {
      return standard.formatDecimal(value, places);
    }
    return formatMantissaWithExponent(formatMantissaBaseTen, this.formatExponent.bind(this),
      10, 1, false
    )(value, places, placesExponent);
  }
}
