import { Notation } from "./notation";
import Decimal from "break_infinity.js";
import { toFixedEngineering, abbreviate } from "./utils";

export class StandardNotation extends Notation {
  public get name(): string {
    return "Standard";
  }

  public formatDecimal(value: Decimal, places: number): string {
    const engineering = toFixedEngineering(value, places);
    const mantissa = engineering.mantissa.toFixed(places);
    const abbreviation = abbreviate(Math.floor(engineering.exponent / 3) - 1);
    return `${mantissa} ${abbreviation}`;
  }
}
