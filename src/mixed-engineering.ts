import type Decimal from "break_infinity.js";
import { Notation } from "./notation";
import { StandardNotation } from "./standard";
import { formatMantissaWithExponent, formatMantissaBaseTen } from "./utils";

const standard = new StandardNotation();

export class MixedEngineeringNotation extends Notation {
  public get name(): string {
    return "Mixed engineering";
  }

  public get canHandleNegativePlaces(): boolean {
    return true;
  }

  public formatDecimal(value: Decimal, places: number): string {
    if (value.exponent < 33) {
      return standard.formatDecimal(value, places);
    }
    return formatMantissaWithExponent(formatMantissaBaseTen, this.formatExponent.bind(this),
    10, 3, false)(value, places);
  }
}
