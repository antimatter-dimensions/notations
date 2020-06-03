import { Notation } from "./notation";
import { formatWithCommas } from "./utils";
import Decimal from "break_infinity.js/break_infinity";

export class LogarithmNotation extends Notation {
  public get name(): string {
    return "Logarithm";
  }

  public formatDecimal(value: Decimal, places: number): string {
    const log10 = value.log10();
    if (value.exponent < 100000) {
      return `e${log10.toFixed(Math.max(places, 1))}`;
    }
    if (this.showCommas(value.exponent)) {
      return `e${formatWithCommas(log10.toFixed(places))}`;
    }
    return `ee${Math.log10(log10).toFixed(3)}`;
  }
}
