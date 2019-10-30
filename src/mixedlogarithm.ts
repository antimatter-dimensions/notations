import { Notation } from "./notation";
import { fixMantissaOverflow } from "./utils";
import Decimal from "break_infinity.js/break_infinity";

export class MixedLogarithmSciNotation extends Notation {
  public get name(): string {
    return "Mixed Logarithm (Scientific Exponent)";
  }

  public formatDecimal(value: Decimal, places: number): string {
    const fixedValue = fixMantissaOverflow(value, places, 10, 1);
    const l = fixedValue.log10();

    if (l >= 100000) {
      const exponent = Math.floor(Math.log10(l));
      const mantissa = l / Math.pow(10, exponent)
      return `e${mantissa.toFixed(places)}e${exponent}`;
    }
    else{
      return `e${l.toFixed(places)}`;
    }
  }
}
