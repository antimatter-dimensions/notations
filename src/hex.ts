import { Notation } from "./notation";
import Decimal from "break_infinity.js/break_infinity";

const SIGNS = {
  POSITIVE: 0,
  NEGATIVE: 1
};

export class HexNotation extends Notation {
  public get name(): string {
    return "Hex";
  }

  public get negativeInfinite(): string {
    return "00000000";
  }

  public get infinite(): string {
    return "FFFFFFFF";
  }

  public formatVerySmallNegativeDecimal(value: Decimal): string {
    return this.formatDecimal(value.negate());
  }

  public formatVerySmallDecimal(value: Decimal): string {
    return this.formatDecimal(value);
  }

  public formatNegativeUnder1000(value: number): string {
    return this.formatDecimal(new Decimal(-value));
  };

  public formatUnder1000(value: number): string {
    return this.formatDecimal(new Decimal(value));
  }

  public formatNegativeDecimal(value: Decimal): string {
    return this.formatDecimal(value.negate());
  };

  public formatDecimal(value: Decimal): string {
    // The `this.rawValue(x, 32)` returns an integer between 0 and 2^32,
    // the .toString(16).toUpperCase().padStart(8, '0') formats it as
    // 8 hexadecimal digits.
    return this.rawValue(value, 32).toString(16)
      .toUpperCase()
      .padStart(8, "0");
  }

  private modifiedLogarithm(x: Decimal): number {
    // This function implements a tweak to the usual logarithm.
    // It has the same value at powers of 2 but is linear between
    // powers of 2 (so for example, f(3) = 1.5).
    const floorOfLog = Math.floor(Decimal.log2(x));
    const previousPowerOfTwo = Decimal.pow(2, floorOfLog);
    const fractionToNextPowerOfTwo = Decimal.div(x, previousPowerOfTwo).toNumber() - 1;
    return floorOfLog + fractionToNextPowerOfTwo;
  }

  private isFinite(x: number | Decimal): boolean {
    if (typeof x === "number") {
      return isFinite(x);
    }
    return isFinite(x.e) && isFinite(x.mantissa);
  }

  private rawValue(inputValue: Decimal | number, numberOfBits: number): number {
    const signs = [];
    for (let i = 0; i < numberOfBits; i++) {
      if (!this.isFinite(inputValue)) {
        break;
      }
      if (Decimal.lt(inputValue, 0)) {
        signs.push(SIGNS.NEGATIVE);
        inputValue = -this.modifiedLogarithm(Decimal.times(inputValue, -1));
      } else {
        signs.push(SIGNS.POSITIVE);
        inputValue = this.modifiedLogarithm(inputValue as Decimal);
      }
    }
    // Convert the signs to a number, adding zeros at the end
    // in case the above loop breaks early.
    let resultValue = parseInt(signs.map(x => (x === SIGNS.POSITIVE) ? 1 : 0)
      .join("")
      .padEnd(numberOfBits, "0"), 2);
    // This conditional is just here for correct rounding.
    if (resultValue !== Math.pow(2, numberOfBits) - 1
      && (inputValue > 0 || (inputValue === 0 && resultValue % 2 === 1))) {
      resultValue += 1;
    }
    return resultValue;
  }
}
