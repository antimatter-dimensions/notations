import { Notation } from "../notation";
import Decimal from "break_infinity.js";

const LOG4 = Math.log10(4);
const NUMBERS = [
  "4-4",
  "4÷4",
  "√4",
  "4-4÷4",
  "4",
  "4+4÷4",
  "4!÷4",
  "4+4-4÷4",
  "4+4",
  "4+4+4÷4",
  "(44-4)÷4",
  "44÷4",
  "(44+4)÷4",
  "44÷4+√4",
  "4×4-√4",
  "4×4-4÷4"
]

export class FoursNotation extends Notation {
  public get name(): string {
    return "Fours";
  }

  public get negativeInfinite(): string {
    return "-4÷(4-4)";
  }

  public get infinite(): string {
    return "4÷(4-4)";
  }

  public formatVerySmallNegativeDecimal(val: Decimal): string {
    return this.display(Decimal.minus(0, val));
  }

  public formatVerySmallDecimal(val: Decimal): string {
    return this.display(val);
  }

  public formatNegativeUnder1000(val: number): string {
    return this.display(new Decimal(-val));
  }

  public formatUnder1000(val: number): string {
    return this.display(new Decimal(val));
  }

  public formatNegativeDecimal(val: Decimal): string {
    return this.display(Decimal.minus(0, val));
  }

  public formatDecimal(val: Decimal): string {
    return this.display(val);
  }

  private display(val: Decimal, formatLargeNumber: boolean = true): string {
    if (val.equals(0)) {
      return NUMBERS[0];
    }

    let str = "";
    let abs = val.abs();

    if (abs.gte(1e9) && formatLargeNumber) {
      let power = abs.log10() / LOG4;
      let powerStr = this.display(new Decimal(power), false);
      if (this.requiresBrackets(powerStr)) {
        str = `4^(${powerStr})`;
      } else {
        str = `4^${powerStr}`;
      }
    } else if (abs.gte(16)) {
      abs = abs.floor();

      let quotient = abs.div(16).floor();
      let remainder = abs.minus(quotient.times(16));

      if (abs.gte(1e12)) {
        // To prevent remainder from becomes greater than 15
        // due to the loss of precision
        remainder = new Decimal(0);
      }

      let pre = "";
      if (!remainder.equals(0)) {
          pre =`${NUMBERS[remainder.toNumber()]}+`;
      }

      let suf = "";
      if (!quotient.equals(1)) {
          suf = this.display(quotient);
        if (this.requiresBrackets(suf)) {
          suf = `*(${suf})`;
        } else {
          suf = `*${suf}`;
        }
      }
      str = `${pre}4*4${suf}`;
    } else if (abs.gte(1)) {
      str = NUMBERS[abs.floor().toNumber()];
    } else if (abs.gte(1e-9) && formatLargeNumber) {
      let reciprocal = Decimal.div(1, abs);
      let denominator = this.display(reciprocal, false);
      if (this.requiresBrackets(denominator)) {
        str = `${NUMBERS[10]}÷(${denominator})`;
      } else {
        str = `${NUMBERS[10]}÷${denominator}`;
      }
    } else {
      let power = abs.log10() / LOG4;
      // Brackets are added as the power will always be negative
      str = `4^(${this.display(new Decimal(power))})`;
    }

    if (val.lt(0)) {
      if (this.requiresBrackets(str)) {
        str = `-(${str})`;
      } else {
        str = `-${str}`;
      }
    }
    return str;
  }

  private requiresBrackets(str: String): boolean {
    // contains +, -, × or ÷, and the first operator is not ^
    return (str.match(/[\+\-\×÷\^]/) || ["^"])[0] !== "^";
  }
}
