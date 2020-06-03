import { Notation } from "../notation";
import Decimal from "break_infinity.js/break_infinity";
import { ScientificNotation } from "../scientific";

const scientific = new ScientificNotation();

export class EvilNotation extends Notation {
  public get name(): string {
    return "Evil";
  }

  public formatDecimal(value: Decimal, places: number): string {
    const loglog = Math.log(value.log(2)) / Math.log(2);
    const roundedLoglog = Math.round(loglog);
    let adjustedValue;
    if (roundedLoglog < 6 || Math.abs(loglog - roundedLoglog) > 0.25) {
      adjustedValue = value;
    } else {
      adjustedValue = value.pow(roundedLoglog % 2 === 0 ? 2 : 1 / 2);
    }
    return scientific.format(adjustedValue, places);
  }
}
