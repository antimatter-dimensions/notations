import { Notation } from "../notation";
import Decimal from "break_infinity.js/break_infinity";

export class HahaFunnyVersionTwoNotation extends Notation {
  public get name(): string {
    return "Funny Number 2.0";
  }

  private logbase69(value: Decimal): number {
    return value.log(69) / Math.LN10;
  }

  public formatDecimal(value: Decimal): string {
    return this.logbase69(value).toString();
  }

  public get infinite(): string {
    return "69420";
  }

  public formatUnder1000(value: number): string {
    return this.formatDecimal(new Decimal(value));
  }
}
