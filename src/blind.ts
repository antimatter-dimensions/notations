import { Notation } from "./notation";

export class BlindNotation extends Notation {
  public get name(): string {
    return "Blind";
  }

  public formatUnder1000(): string {
    return " ";
  }

  public formatDecimal(): string {
    return " ";
  }
}
