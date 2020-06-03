import { Notation } from "./notation";
import Decimal from "break_infinity.js/break_infinity";
import { ScientificNotation } from "./scientific";
import { LettersNotation } from "./letters";
import { StandardNotation } from "./standard";
import { LogarithmNotation } from "./logarithm";
import { BracketsNotation } from "./brackets";
import { InfinityNotation } from "./infinity";
import { RomanNotation } from "./roman";
import { DotsNotation } from "./dots";
import { ZalgoNotation } from "./zalgo";
import { HexNotation } from "./hex";
import { ImperialNotation } from "./imperial";
import { ClockNotation } from "./clock";
import { PrimeNotation } from "./prime";
import { BarNotation } from "./bar";
import { ShiNotation } from "./shi";
import { BlindNotation } from "./blind";

const notationList = [
  new ScientificNotation(),
  new LettersNotation(),
  new StandardNotation(),
  new LogarithmNotation(),
  new BracketsNotation(),
  new InfinityNotation(),
  new RomanNotation(),
  new DotsNotation(),
  new ZalgoNotation(),
  new HexNotation(),
  new ImperialNotation(),
  new ClockNotation(),
  new PrimeNotation(),
  new BarNotation(),
  new ShiNotation(),
  new BlindNotation(),
]

export class AllNotation extends Notation {
  public get name(): string {
    return "ALL";
  }

  public formatNegativeUnder1000(value: number, places: number): string {
    return this.formatDecimal(new Decimal(-value), places);
  }

  public formatUnder1000(value: number, places: number): string {
    return this.formatDecimal(new Decimal(value), places);
  }

  public formatNegativeDecimal(value: Decimal, places: number): string {
    return this.formatDecimal(new Decimal(-value), places);
  }

  public formatDecimal(value: Decimal, places: number): string {
    const index = Math.floor(Math.log2(value.abs().plus(2).log2()));
    const notation = notationList[index % notationList.length];
    return notation.format(value, places, places);
  }
}
