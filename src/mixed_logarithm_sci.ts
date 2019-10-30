import { Notation } from "./notation";
import { ScientificNotation } from "./scientific";
import Decimal from "break_infinity.js/break_infinity";

const scientific = new ScientificNotation();

export class MLogSciNotation extends Notation {
  public get name(): string {
    return "Mixed Logarithm (Scientific Exponent)";
  }

  public formatDecimal(value: Decimal, places: number): string {
    const l = new Decimal(value.log10());

    if (l.exponent >= 5) {
      return `e${scientific.formatDecimal(l, places)}`;
    }
    else{
      return `e${l.toFixed(places)}`;
    }
  }
}
