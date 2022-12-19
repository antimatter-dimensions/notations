import Decimal from "break_infinity.js";
import { Notation } from "../notation";
import { ScientificNotation } from "../scientific";

const scientific = new ScientificNotation();

export class MixedLogarithmSciNotation extends Notation {
  public get name(): string {
    return "Mixed Logarithm (Sci)";
  }

  public formatDecimal(value: Decimal, places: number, placesExponent: number): string {
    if (value.exponent < 33) {
      return scientific.formatDecimal(value, places, placesExponent);
    }
    const log10 = value.log10();
    return `e${this.formatExponent(log10, places, (n, p) => n.toFixed(p), placesExponent)}`;
  }
}
