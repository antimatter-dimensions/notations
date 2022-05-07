import type Decimal from "break_infinity.js";
import { Notation } from "./notation";
import { formatMantissaWithExponent, formatMantissaBaseTen } from "./utils";

export class ScientificNotation extends Notation {
  public get name(): string {
    return "Scientific";
  }

  public formatDecimal(value: Decimal, places: number, placesExponent: number): string {
    return formatMantissaWithExponent(formatMantissaBaseTen, this.formatExponent.bind(this),
      10, 1, false
      )(value, places, placesExponent);
  }
}
