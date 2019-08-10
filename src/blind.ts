import { Notation } from "./notation";

export class BlindNotation extends Notation {
  public get name(): string {
    return "Blind";
  }

  public get infinite(): string {
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
