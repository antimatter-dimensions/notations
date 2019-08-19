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

  public get infinite(): string {
    return "FFFFFFFF";
  }

  public formatNegativeUnder1000(value: number): string {
    return this.formatDecimal(new Decimal(-value));
  };

  public formatNegativeDecimal(value: Decimal): string {
    return this.formatDecimal(value.negate());
  };

  public formatUnder1000(value: number): string {
    return this.formatDecimal(new Decimal(value));
  }

  public formatDecimal(value: Decimal): string {
    // The `this.rawValue(x, 32, 8)` returns an integer between 0 and 2^32,
    // the .toString(16).toUpperCase().padStart(8, '0') formats it as
    // 8 hexadecimal digits.
    return this.rawValue(value, 32, 8).toString(16)
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

  private rawValue(value: Decimal, numberOfBits: number, extraPrecisionForRounding: number): number {
    return this.getValueFromSigns(this.getSigns(value, numberOfBits, extraPrecisionForRounding), numberOfBits);
  }

  private isFinite(x: number | Decimal): boolean {
    if (typeof x === "number") {
      return isFinite(x);
    }
    return isFinite(x.e) && isFinite(x.mantissa);
  }

  private getSigns(value: Decimal | number, numberOfBits: number, extraPrecisionForRounding: number): number[] {
    // Extra precision is an arbitrary number, it only controls rounding of
    // the last digit, if it's 0 the last digit will almost always be odd
    // for non-dyadic x, if it's too high the code might be slower.
    // 8 (the value used) should be high enough for good results.
    const signs = [];
    for (let i = 0; i < numberOfBits + extraPrecisionForRounding; i++) {
      if (!this.isFinite(value)) {
        break;
      }
      if (Decimal.lt(value, 0)) {
        signs.push(SIGNS.NEGATIVE);
        value = Decimal.times(value, -1);
      } else {
        signs.push(SIGNS.POSITIVE);
      }
      value = this.modifiedLogarithm(value as Decimal);
    }
    return signs;
  }

  private getValueFromSigns(signs: number[], numberOfBits: number): number {
    // We need to use 0 as the initial value for result,
    // rather than, for example, 0.5. This is so that the sign list of 0
    // (passed in here as signs), which is just [Notation.hex.signs.POSITIVE],
    // becomes 1 / 2 + 0 = 0.5.
    // Another way of thinking about this:
    // The general way getSigns terminates, when it starts with a finite number,
    // is by taking the log of 0, which is -Infinity, which is the lowest number,
    // and which is also not finite, leading to the getSigns loop breaking. If you pass
    // -Infinity into getSigns, the result will be an empty list, so we want this function
    // to turn an empty list into 0. So the initial value has to be 0.
    // If you pass Infinity into getSigns, the result will also be an empty list,
    // but modifiedLogarithm never returns Infinity so the only way value can be Infinity
    // in getSigns is if Infinity was initially passed in, which should never happen.
    let result = 0;
    for (let i = signs.length - 1; i >= 0; i--) {
      if (signs[i] === SIGNS.NEGATIVE) {
        result = 1 / 2 - result / 2;
      } else {
        result = 1 / 2 + result / 2;
      }
    }
    return Math.round(result * Math.pow(2, numberOfBits));
  }
}
