import { Notation } from "../notation";
import Decimal from "break_infinity.js/break_infinity";

const LOG69 = Math.log(69);

export class HahaFunnyNotation extends Notation {
  public get name(): string {
    return "Haha Funny";
  }

  public formatDecimal(value: Decimal): string {
    if (value.eq(0)) {
      return "42069";
    }
    if (value.lt(1)) {
      return this.formatDecimal(value.pow(-1)).split("").reverse().join("");
    }
    const log69 = Math.LN10 / LOG69 * value.log10();
    let log = Math.floor(log69 * Math.pow(69, 2));
    const parts = [];
    while (log > 0 || parts.length < 3) {
      const remainder = log % 69;
      log = Math.floor(log / 69);
      parts.push((remainder + 1).toString());
    }
    return parts.join("");
  }

  public get infinite(): string {
    return "69420";
  }

  public formatUnder1000(value: number): string {
    return this.formatDecimal(new Decimal(value));
  }
}