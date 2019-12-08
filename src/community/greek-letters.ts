import { Notation } from "../notation";
import Decimal from "break_infinity.js/break_infinity";

export class GreekLettersNotation extends Notation {
  public get name(): string {
    return "Greek Letters";
  }

  private get greek(): string[] {
    return "άαβγδεζηθικλμνξοπρστυφχψωΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ".split("");
  }

  public formatDecimal(value: Decimal, places: number): string {
    let exp = Math.floor(value.e / 3);
    let step = Math.pow(this.greek.length, Math.floor(Math.log(exp) / Math.log(this.greek.length)));
    let suffix = "";
    while (step >= 1) {
      let ordinal = Math.floor(exp / step);
      suffix += this.greek[ordinal];
      exp -= step * ordinal;
      step /= this.greek.length;
    }
    let mantissa = Decimal.pow(10, Decimal.log10(value) % 3).toFixed(places);
    return mantissa + " " + suffix;
  }
}
