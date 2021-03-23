<<<<<<< HEAD
import { Notation } from "./notation";
import Decimal from "break_infinity.js";

// The reason these have to be these unicode boxes and not their escape characters 
// is beyond me. However, you can trust that these will render correctly, as they
// are part of the font found in docs/MonospaceTypewriter.ttf
const BARS = ["", "", "", "", "", "", "", ""];
const NEGATIVE_BARS = ["", "", "", "", "", "", "", ""];
const LOG8 = Math.log(8);

export class BarNotation extends Notation {
  public get name(): string {
    return "Bar";
  }
  
  public get negativeInfinite(): string {
    return "";
  }

  public get Infinite(): string {
    return "";
  }
  
  public formatVerySmallNegativeDecimal(value: Decimal): string {
    return this.flipBars(this.formatDecimal(value));
  }

  public formatVerySmallDecimal(value: Decimal): string {
    return this.formatDecimal(value);
  }

  public formatNegativeUnder1000(value: number): string {
    return this.flipBars(this.formatDecimal(new Decimal(value)));
  }

  public formatUnder1000(value: number): string {
    return this.formatDecimal(new Decimal(value));
  }

  public formatNegativeDecimal(value: Decimal): string {
    return this.flipBars(this.formatDecimal(value));
  }
  
  public formatDecimal(value: Decimal): string {
    if (value.eq(0)) {
      return '0';
    }
    if (value.lessThan(1) && value.greaterThan(0)) {
      return '/' + this.formatDecimal(Decimal.div(1, value));
    }
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
  public flipBars(parts: string): string {
    let newParts = [];
    for (let i = 0; i < parts.length; i++) {
      newParts.push(NEGATIVE_BARS[BARS.indexOf(parts[i])])
    }
    return newParts.join("");
  }
}
=======
import { Notation } from "./notation";
import Decimal from "break_infinity.js/break_infinity";

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
>>>>>>> 5a7ca1fd8bc6f0171d78f826a4c8baf6690d6f25
