import { Notation } from "../notation";
import Decimal from "break_infinity.js";

const LOG4 = Math.log10(4);
const NUMBERS = [
  "4-4", "4÷4", "√4", "4-4÷4", "4", "4+4÷4", "4!÷4", "4+4-4÷4", "4+4",
  "4+4+4÷4", "(44-4)÷4", "44÷4", "(44+4)÷4", "44÷4+√4", "4×4-√4", "4×4-4÷4"
];

export class FoursNotation extends Notation {
  public get name(): string {
    return "Fours";
  }

  public get negativeInfinite(): string {
    return "-∞";
  }

  public get infinite(): string {
    return "∞";
  }

  public formatVerySmallNegativeDecimal(val: Decimal): string {
    return this.formatNegativeDecimal(val);
  }

  public formatVerySmallDecimal(val: Decimal): string {
    return this.formatDecimal(val);
  }


  public formatNegativeUnder1000(val: number): string {
    const str = this.formatUnder1000(val);
    return `-${this.bracketify(str)}`;
  }

  public formatUnder1000(val: number): string {
    const exponent = Math.log10(val);
    if (val === 0) {
      return NUMBERS[0];
    }

    if (exponent < 0) {
      return this.formatAsFraction(val);
    }

    return this.formatAsInteger(val);
  }

  public formatNegativeDecimal(val: Decimal): string {
    const str = this.formatDecimal(val);
    return `-${this.bracketify(str)}`;
  }

  public formatDecimal(val: Decimal): string {
    if (val.sign() < 0) {
      return this.formatNegativeDecimal(Decimal.minus(0, val));
    }

    const exponent = val.log10();
    const absoluteExponent = Math.abs(exponent);

    if (absoluteExponent >= 24) {
      return this.formatAsPow(val);
    }

    if (absoluteExponent >= 3) {
      return this.formatAsRoot(val);
    }

    return this.formatUnder1000(val.toNumber());
  }

  private formatAsPow(val: Decimal): string {
    const power = val.log10() / LOG4;
    const powerStr = this.formatDecimal(new Decimal(power));
    return `4^${this.bracketify(powerStr)}`;
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

      const pre = remainder === 0 ? "" : `${NUMBERS[Math.floor(remainder)]}+`;
      const suf = quotient === 1 ? "" : `×${this.multiBracketify(this.formatAsInteger(quotient))}`;

      return `${pre}4×4${suf}`;
    }

    return NUMBERS[Math.floor(val)];
  }

  private formatAsFraction(val: number): string {
    const reciprocal = 1 / val;
    const denominator = this.formatUnder1000(reciprocal);
    return `${NUMBERS[1]}÷${this.bracketify(denominator)}`;
  }

  private bracketify(str: string): string {
    // contains +, -, × or ÷, and the first operator is not ^
    if ((str.match(/[\+\-\×÷\^]/) || ["^"])[0] !== "^") {
      return `(${str})`;
    }
    return str;
  }

  private multiBracketify(str: string): string {
    let charPos = 0;
    // store the current bracket layer
    // Brackets are only needed if there is a + or - in layer 0
    // str will never contain ^, so the character is ignored
    let bracketLayer = 0;
    while (charPos < str.length) {
      const char = str.charAt(charPos);
      if ((char === "+" || char === "-") && bracketLayer === 0) {
        return `(${str})`;
      }
      bracketLayer += this.bracket(char);
      charPos++;
    }
    return str;
  }

  private bracket(char: string): number {
    switch (char) {
      case "(":
        return 1;
      case ")":
        return -1;
      default:
        return 0;
    }
  }
}
