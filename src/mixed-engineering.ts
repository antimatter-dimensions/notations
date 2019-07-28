import { Notation } from "./notation";
import Decimal from "break_infinity.js/break_infinity";
import { StandardNotation } from "./standard";
import { EngineeringNotation } from "./engineering";

const standard = new StandardNotation();
const engineering = new EngineeringNotation();

export class MixedEngineeringNotation extends Notation {
  public get name(): string {
    return "Mixed engineering";
  }

  public formatDecimal(value: Decimal, places: number): string {
    const notation = value.exponent >= 33 ? engineering : standard;
    return notation.formatDecimal(value, places);
  }
}
