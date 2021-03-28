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
    return this.formatNegativeDecimal(val);
  }

  public formatVerySmallDecimal(val: Decimal): string {
    return this.formatDecimal(val);
  }


  public formatNegativeUnder1000(val: number): string {
    return this.formatNegativeDecimal(new Decimal(val));
  }

  public formatUnder1000(val: number): string {
    return this.formatDecimal(new Decimal(val));
  }

  public formatNegativeDecimal(val: Decimal): string {
    const str = this.formatDecimal(val);
    if (this.requiresBrackets(str)) {
      return `-(${str})`;
    }
    return `-${str}`;
  }

  public formatDecimal(val: Decimal): string {
    if (val.sign() < 0) {
      return this.formatNegativeDecimal(Decimal.minus(0, val));
    }

    if (val.equals(0)) {
      return NUMBERS[0];
    }

    const exponent = val.log10()
    const absoluteExponent = Math.abs(exponent);

    if (absoluteExponent >= 24) {
      return this.formatAsPow(val);
    }

    if (absoluteExponent >= 3) {
      return this.formatAsRoot(val);
    }

    if (exponent < 0) {
      return this.formatAsFraction(val.toNumber());
    }

    return this.formatAsInteger(val.toNumber());
  }

  private formatAsPow(val:Decimal): string {
    const power = val.log10() / LOG4;
    const powerStr = this.formatDecimal(new Decimal(power));
    if (this.requiresBrackets(powerStr)) {
      return `4^(${powerStr})`;
    }
    return `4^${powerStr}`;
  }

  private formatAsRoot(val: Decimal): string {
    const root = Decimal.sqrt(val);
    const str = this.formatDecimal(root);
    // str will never be 4 or 4^(x), so it always requires a bracket
    return `(${str})^${NUMBERS[2]}`;
  }

  private formatAsInteger(val: number): string {
    if (val >= 16) {
      const quotient = Math.floor(val / 16);
      const remainder = Math.floor(Math.max(0, Math.min(15, val - quotient * 16)));

      let pre = remainder === 0 ? "" : `${NUMBERS[remainder]}+`

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

    return NUMBERS[Math.floor(val)];
  }

  private formatAsFraction(val: number): string {
    const reciprocal = 1 / val;
    const denominator = this.formatUnder1000(reciprocal);
    if (this.requiresBrackets(denominator)) {
      return `${NUMBERS[1]}÷(${denominator})`;
    } else {
      return `${NUMBERS[1]}÷${denominator}`;
    }
  }

  private requiresBrackets(str: string): boolean {
    // contains +, -, × or ÷, and the first operator is not ^
    return (str.match(/[\+\-\×÷\^]/) || ["^"])[0] !== "^";
  }
}
