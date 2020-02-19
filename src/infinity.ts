import { Notation } from "./notation";
import Decimal from "break_infinity.js/break_infinity";
import { formatWithCommas } from "./utils";
import { Settings } from "./settings";

const LOG10_MAX_VALUE = Math.log10(Number.MAX_VALUE);

export class InfinityNotation extends Notation {
  public get name(): string {
    return "Infinity";
  }

  public formatDecimal(value: Decimal, places: number): string {
    const log10 = value.log10();
    const infinities = log10 / LOG10_MAX_VALUE;
    const infPlaces = infinities < 1000 ? 4 : 3;
    const formatted = infinities.toFixed(Math.max(infPlaces, places));
    if (Settings.exponentCommas.show) {
      return `${formatWithCommas(formatted)}∞`;
    }

    return `${formatted}∞`;
  }
}
