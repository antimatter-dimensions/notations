import { Notation } from "./notation";
import Decimal from "break_infinity.js";

const BARS = ["", "", "", "", "", "", "", ""];
const LOG8 = Math.log(8);

export class BarNotation extends Notation {
  public get name(): string {
    return "Bar";
  }

  public formatDecimal(value: Decimal): string {
    const log8 = Math.LN10 / LOG8 * value.log10();
    let wholeLog = Math.floor(log8);
    const decimalLog = log8 - wholeLog;
    const decimalLog64 = Math.floor(decimalLog * 64);
    const parts = [
      BARS[decimalLog64 % 8],
      BARS[Math.floor(decimalLog64 / 8)]
    ];
    while (wholeLog >= 8) {
      const remainder = wholeLog % 8;
      wholeLog = (wholeLog - remainder) / 8;
      parts.push(BARS[remainder]);
    }
    parts.push(BARS[wholeLog]);
    return parts.join("");
  }
}
