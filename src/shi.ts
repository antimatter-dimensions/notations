import Decimal from "break_infinity.js";
import { Notation } from "./notation";

// https://en.wikipedia.org/wiki/Lion-Eating_Poet_in_the_Stone_Den
const SHI = "世使侍勢十史嗜士始室實屍市恃拭拾施是時氏濕獅矢石視試詩誓識逝適釋食";

export class ShiNotation extends Notation {
  public get name(): string {
    return "Shi";
  }

  public get infinite(): string {
    return this.shi(Decimal.NUMBER_MAX_VALUE);
  }

  public formatUnder1000(value: number): string {
    return this.shi(new Decimal(value));
  }

  public formatDecimal(value: Decimal): string {
    return this.shi(value);
  }

  private getShiCharacter(x: number): string {
    return SHI[Math.floor(x) % SHI.length];
  }

  private shi(value: Decimal): string {
    const scaled = (value.plus(1).log10() * 1000) ** 0.08;
    let shi = "";
    for (let i = 0; i < 3; i++) {
      shi += this.getShiCharacter(scaled * SHI.length ** i);
    }
    return shi;
  }
}
