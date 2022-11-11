import Decimal from "break_infinity.js";
import { Notation } from "./notation";

const SIGNS = {
  positive: 0,
  negative: 1
};

export class HexNotation extends Notation {
  public get name(): string {
    return "Hex";
  }

  public get negativeInfinite(): string {
    return "00000000";
  }

  public get infinite(): string {
    return "FD400000";
  }

  public formatVerySmallNegativeDecimal(value: Decimal): string {
    return this.formatDecimal(value.negate());
  }

  public formatVerySmallDecimal(value: Decimal): string {
    return this.formatDecimal(value);
  }

  public formatNegativeUnder1000(value: number): string {
    return this.formatDecimal(new Decimal(-value));
  }

  public formatUnder1000(value: number): string {
    return this.formatDecimal(new Decimal(value));
  }

  public formatNegativeDecimal(value: Decimal): string {
    return this.formatDecimal(value.negate());
  }

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

  private isFinite(x: Decimal | number): boolean {
    if (typeof x === "number") {
      return isFinite(x);
    }
    return isFinite(x.e) && isFinite(x.mantissa);
  }

  private rawValue(inputValue: Decimal | number, numberOfBits: number): number {
    let value = inputValue;
    const signs = [];
    for (let i = 0; i < numberOfBits; i++) {
      if (!this.isFinite(value)) {
        break;
      }
      if (Decimal.lt(value, 0)) {
        signs.push(SIGNS.negative);
        value = -this.modifiedLogarithm(Decimal.times(value, -1));
      } else {
        signs.push(SIGNS.positive);
        value = this.modifiedLogarithm(value as Decimal);
      }
    }
    // Convert the signs to a number, adding zeros at the end
    // in case the above loop breaks early.
    let resultValue = parseInt(signs.map((x) => x === SIGNS.positive ? 1 : 0)
      .join("")
      .padEnd(numberOfBits, "0"), 2);
    // This conditional is just here for correct rounding.
    if (resultValue !== 2 ** numberOfBits - 1 &&
      (value > 0 || value === 0 && resultValue % 2 === 1)) {
      resultValue += 1;
    }
    return resultValue;
  }
}
