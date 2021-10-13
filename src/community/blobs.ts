import { Notation } from "../notation";
import Decimal from "break_infinity.js";

const LOG3 = Math.log10(3);
const EMPTY = "";
const NEGATIVE = "notlike";
const INFINITY = "finity";
const PREFIXES = [EMPTY, "big", "large", "great", "grand", "huge", "super", "ultra", "mega", "giga", "omega"];
const SUFFIXES = [EMPTY, "think", "wave", "hug", "nom", "sad", "pats", "yes", "no", "heart", "sleep"];

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

  private blobify(num: Decimal): string {
    let prefix = "", suffix = "";
    let number = this.reduceNumber(num.abs());
    if (num.sign() === -1) {
      prefix = NEGATIVE;
      // To allow the combination :notlikeblob: to appear
      number = Math.max(0, number - 1);
    }

    const indexes = [0, 0, 0];

    indexes[2] = number % SUFFIXES.length;
    number = (number - indexes[2]) / SUFFIXES.length;
    indexes[1] = number % PREFIXES.length;
    indexes[0] = (number - indexes[1]) / PREFIXES.length;

    if (indexes[0] >= 1) {
      suffix = `-${indexes[0] - 1}`;
    }

    return this.blobConstructor(prefix + PREFIXES[Math.floor(indexes[1])],
                                SUFFIXES[Math.floor(indexes[2])] + suffix);
  }

  private reduceNumber(num: Decimal): number {
    if (num.lte(1000)) {
      // 0 - 1000: increment by 1
      return num.toNumber();
    }
    // 1001 and above: previous number ^ 1.001
    return (Math.log10(num.log10()) - LOG3) / Math.log10(1.001) + 1000;
  }

  private blobConstructor(prefix: string, suffix: string): string {
    return `:${prefix}blob${suffix}:`;
  }
}
