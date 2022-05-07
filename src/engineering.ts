import type Decimal from "break_infinity.js";
import { Notation } from "./notation";
import { formatMantissaWithExponent, formatMantissaBaseTen } from "./utils";

export class EngineeringNotation extends Notation {
  public get name(): string {
    return "Engineering";
  }

  public formatDecimal(value: Decimal, places: number, placesExponent: number): string {
    return formatMantissaWithExponent(formatMantissaBaseTen, this.formatExponent.bind(this),
      10, 3, false
    )(value, places, placesExponent);
  }
}
