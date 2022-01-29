import type Decimal from "break_infinity.js";
import { Notation } from "./notation";
import { formatMantissaWithExponent, formatMantissaBaseTen, abbreviateStandard } from "./utils";

export class StandardNotation extends Notation {
  public readonly name = "Standard";

  public formatDecimal(value: Decimal, places: number): string {
    return formatMantissaWithExponent(formatMantissaBaseTen, abbreviateStandard,
      1000, 1, false, " ", true)(value, places);
  }
}
