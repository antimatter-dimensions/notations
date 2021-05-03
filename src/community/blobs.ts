import { Notation } from "../notation";
import Decimal from "break_infinity.js";

const LOG2 = Math.log10(2);
const EMPTY = "";
const NEGATIVE = "notlike";
const INFINITY = "finity";
// IMPORTANT: The size of PREFIXES and SUFFIXES should be the SAME!
// some of them WILL NOT APPEAR if the size of the lists are different.
const PREFIXES = [EMPTY, "big", "large", "great", "huge", "super", "ultra", "mega", "giga", "omega"];
const SUFFIXES = [EMPTY, "think", "wave", "hug", "nom", "sad", "pats", "yes", "no", "heart"];

export class BlobsNotation extends Notation {
  public get name(): string {
    return "Blobs";
  }

  public get negativeInfinite(): string {
    return this.blobConstructor(NEGATIVE, INFINITY);
  }

  public get infinite(): string {
    return this.blobConstructor(EMPTY, INFINITY);
  }

  public formatVerySmallNegativeDecimal(num: Decimal): string {
    return this.blobify(Decimal.sub(0, num));
  }

  public formatNegativeUnder1000(num: number): string {
    return this.blobify(new Decimal(-num));
  }

  public formatUnder1000(num: number): string {
    return this.blobify(new Decimal(num));
  }

  public formatNegativeDecimal(num: Decimal): string {
    return this.blobify(Decimal.sub(0, num));
  }

  public formatDecimal(num: Decimal): string {
    return this.blobify(num);
  }

  public blobify(num: Decimal): string {
    let prefix = "", suffix = "";
    let number = num;
    if (num.sign() === -1) {
      prefix = NEGATIVE;
      // To allow the combination :notlikeblob: to appear
      number = Decimal.min(0, num.add(1));
    }

    let exp = Math.floor(number.abs().add(1).log10() / LOG2);
    const base = Math.min(PREFIXES.length, SUFFIXES.length);
    let size = 0, pre = 0, suf = 0;

    // The exponent is converted to base X, where X is the number of prefixes / suffixes
    // The numerical prefix and suffixes are the first and second digit
    // of the converted number respectively.
    // -X is added to represent the number of digits of converted number, minus 1.
    // It will appear once the size reaches 3.

    if (exp !== 0) {
      size = Math.max(Math.floor(Math.log10(exp) / Math.log10(base)) + 1, 2);

      pre = Math.floor(exp / Math.pow(base, size - 1));
      exp -= pre * Math.pow(base, size - 1);
      suf = Math.floor(exp / Math.pow(base, size - 2));
    }

    if (size >= 3) {
      suffix = `-${size - 1}`;
    }

    return this.blobConstructor(prefix + PREFIXES[pre], SUFFIXES[suf] + suffix);
  }

  public blobConstructor(prefix: string, suffix: string): string {
    return `:${prefix}blob${suffix}:`;
  }
}
