import { Notation } from "../notation";
import Decimal from "break_infinity.js";
import { toFixedLongScale, abbreviate } from "../utils";

// Name comes from https://en.wikipedia.org/wiki/Long_and_short_scales
// Period-comma swaps are because where the long scale is used, the period
// is generally used rather than the comma in numbers compared to where
// the short scale is used, and vice versa.
export class LongScaleNotation extends Notation {
  public get name(): string {
    return "Long scale";
  }

  public formatDecimal(value: Decimal, places: number): string {
    const longScale = toFixedLongScale(value, places);
    const mantissa = longScale.mantissa.toFixed(places);
    const abbreviation = abbreviate(Math.floor(longScale.exponent / 6));
    return `${mantissa} ${abbreviation}`.replace(/[,.]/g, x => x === '.' ? ',' : '.');
  }
  
  public formatUnder1000(value: number, places: number): string {
    return value.toFixed(places).replace('.', ',');
  }
}