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
];

// TODO: Big refactor (actually use the format under 1000 shits etc)

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
    return `-${this.formatVerySmallDecimal(val)}`;
  }

  public formatVerySmallDecimal(val: Decimal): string {
    return this.formatDecimal(val);
  }

  public formatNegativeUnder1000(val: number): string {
    let str = this.formatUnder1000(val);
    if (this.requiresBrackets(str)) {
      return `-(${str})`;
    }
    return `-${str}`;
  }

  public formatUnder1000(val: number): string {
    if (val === 0) {
      return NUMBERS[0];
    }

    if (val >= 16) {
      const quotient = Math.floor(val / 16);
      const remainder = Math.max(0, Math.min(15, Math.floor(val - quotient * 16)));

      let pre = "";
      if (remainder !== 0) {
        pre =`${NUMBERS[remainder]}+`;
      }

      let suf = "";
      if (quotient !== 1) {
        suf = this.formatUnder1000(quotient);
        if (this.requiresBrackets(suf)) {
          suf = `×(${suf})`;
        } else {
          suf = `×${suf}`;
        }
      }

      return `${pre}4×4${suf}`;
    }

    if (val >= 1) {
      return NUMBERS[Math.floor(val)];
    }

    if (val > 1e-3) {
      const reciprocal = 1 / val;
      const denominator = this.formatUnder1000(reciprocal);
      if (this.requiresBrackets(denominator)) {
        return `${NUMBERS[1]}÷(${denominator})`;
      } else {
        return `${NUMBERS[1]}÷${denominator}`;
      }
    }

    return this.formatDecimal(new Decimal(val));
  }

  public formatNegativeDecimal(val: Decimal): string {
    let str = this.formatDecimal(val);
    if (this.requiresBrackets(str)) {
      return `-(${str})`;
    }
    return `-${str}`;
  }

  public formatDecimal(val: Decimal): string {
    if (val.sign() < 0) {
      return this.formatNegativeDecimal(Decimal.minus(0, val));
    }
    // Precision is lost if the number is too small,
    // so a different formatting is used instead
    if (val.gte(1e24) || val.lte(1e-24)) {
      const power = val.log10() / LOG4;
      const powerStr = this.formatDecimal(new Decimal(power));
      if (this.requiresBrackets(powerStr)) {
        return `4^(${powerStr})`;
      }
      return `4^${powerStr}`;
    }

    if (val.gte(1e3) || val.lte(1e-3)) {
      const root = Decimal.sqrt(val);
      const str = this.formatDecimal(root);
      // str will never be 4 or 4^(x), so it always requires a bracket
      return `(${str})^${NUMBERS[2]}`;
    }

    return this.formatUnder1000(val.toNumber());
  }

  private requiresBrackets(str: string): boolean {
    // contains +, -, × or ÷, and the first operator is not ^
    return (str.match(/[\+\-\×÷\^]/) || ["^"])[0] !== "^";
  }
}
