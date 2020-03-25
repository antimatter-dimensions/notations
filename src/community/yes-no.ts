import { Notation } from "../notation";
import Decimal from "break_infinity.js/break_infinity";

export class YesNoNotation extends Notation {
  public get name(): string {
    return "YesNo";
  }

  public get negativeInfinite(): string {
    return "YES";
  }

  public get infinite(): string {
    return "YES";
  }

  public formatVerySmallNegativeDecimal(x: Decimal): string {
    return x.neq(0) ? "YES" : "NO";
  }

  public formatVerySmallDecimal(x: Decimal): string {
    return x.neq(0) ? "YES" : "NO";
  }

  public formatNegativeUnder1000(x: number): string {
    return x !== 0 ? "YES" : "NO";
  }

  public formatUnder1000(x: number): string {
    return x !== 0 ? "YES" : "NO";
  }

  public formatNegativeDecimal(x: Decimal): string {
    return x.neq(0) ? "YES" : "NO";
  }

  public formatDecimal(x: Decimal): string {
    return x.neq(0) ? "YES" : "NO";
  }
}