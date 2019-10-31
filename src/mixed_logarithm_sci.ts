import { Notation } from "./notation";
import { ScientificNotation } from "./scientific";
import { Settings } from "./settings";
import { formatWithCommas } from "./utils";
import Decimal from "break_infinity.js/break_infinity";

const scientific = new ScientificNotation();

export class MLogSciNotation extends Notation {
  public get name(): string {
    return "Mixed Logarithm (Sci)";
  }

  public formatDecimal(value: Decimal, places: number): string {
    if (value.exponent < 33) return scientific.formatDecimal(value, places);
    return `e${this.formatLog(value.log10(), places)}`;
  }

  protected formatLog(exponent: number, places: number): string {
    if (exponent < Settings.exponentCommas.min) {
      return exponent.toFixed(places);
    }
    if (this.showCommas(exponent)) {
      return formatWithCommas(exponent.toFixed(places));
    }
    return scientific.formatDecimal(new Decimal(exponent), 3);
  }

}
