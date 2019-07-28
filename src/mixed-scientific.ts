import { Notation } from "./notation";
import Decimal from "break_infinity.js/break_infinity";
import { ScientificNotation } from "./scientific";
import { StandardNotation } from "./standard";

const standard = new StandardNotation();
const scientific = new ScientificNotation();

export class MixedScientificNotation extends Notation {
  public get name(): string {
    return "Mixed scientific";
  }

  public formatDecimal(value: Decimal, places: number): string {
    const notation = value.exponent >= 33 ? scientific : standard;
    return notation.formatDecimal(value, places);
  }
}
