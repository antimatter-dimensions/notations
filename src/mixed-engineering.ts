import { Notation } from "./notation";
import Decimal from "break_infinity.js/break_infinity";
import { StandardNotation } from "./standard";
import { toFixedEngineering } from "./utils";

const standard = new StandardNotation();

export class MixedEngineeringNotation extends Notation {
  public get name(): string {
    return "Mixed engineering";
  }

  public formatDecimal(value: Decimal, places: number): string {
    if (value.exponent < 33) {
      return standard.formatDecimal(value, places);
    }
    const engineering = toFixedEngineering(value, places);
    const mantissa = engineering.mantissa.toFixed(places);
    const exponent = this.formatExponent(engineering.exponent);
    return `${mantissa}e${exponent}`;
  }
}
