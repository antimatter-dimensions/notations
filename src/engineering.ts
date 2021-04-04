import type Decimal from "break_infinity.js";
import { Notation } from "./notation";
import { toFixedEngineering } from "./utils";

export class EngineeringNotation extends Notation {
  public get name(): string {
    return "Engineering";
  }

  public formatDecimal(value: Decimal, places: number): string {
    const engineering = toFixedEngineering(value, places);
    const mantissa = engineering.mantissa.toFixed(places);
    const exponent = this.formatExponent(engineering.exponent);
    return `${mantissa}e${exponent}`;
  }
}
