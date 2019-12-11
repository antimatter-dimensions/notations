import { Notation } from "./notation";

export class BlindNotation extends Notation {
  public get name(): string {
    return "Blind";
  }

  public get negativeInfinite(): string {
    return " ";
  }

  public get infinite(): string {
    return " ";
  }

  public formatVerySmallNegativeDecimal(): string {
    return " ";
  }

  public formatVerySmallDecimal(): string {
    return " ";
  }

  public formatNegativeUnder1000(): string {
    return " ";
  }

  public formatUnder1000(): string {
    return " ";
  }

  public formatNegativeDecimal(): string {
    return " ";
  }

  public formatDecimal(): string {
    return " ";
  }
}
