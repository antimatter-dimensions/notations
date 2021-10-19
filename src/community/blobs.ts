import { Notation } from "../notation";
import Decimal from "break_infinity.js";

const LOG3 = Math.log10(3);

export class BlobsNotation extends Notation {
  public get name(): string {
    return "Blobs";
  }

  protected get prefixes(): Array<string> {
    return ["", "big", "large", "great", "grand", "huge", "super", "ultra", "mega", "giga", "omega"];
  }

  protected get suffixes(): Array<string> {
    return ["", "think", "wave", "hug", "nom", "sad", "pats", "yes", "no", "heart", "sleep"];
  }

  protected get prefix_negative(): string {
    return "notlike";
  }

  protected get suffix_infinity(): string {
    return "finity";
  }

  public get negativeInfinite(): string {
    return this.blobConstructor(this.prefix_negative, this.suffix_infinity);
  }

  public get infinite(): string {
    return this.blobConstructor("", this.suffix_infinity);
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

  protected blobify(num: Decimal): string {
    let prefix = "", suffix = "";
    let number = this.reduceNumber(num.abs());
    if (num.sign() === -1) {
      prefix = this.prefix_negative;
      // To allow the combination :notlikeblob: to appear
      number = Math.max(0, number - 1);
    }

    const indexes = [0, 0, 0];

    indexes[2] = number % this.suffixes.length;
    number = (number - indexes[2]) / this.suffixes.length;
    indexes[1] = number % this.prefixes.length;
    indexes[0] = (number - indexes[1]) / this.prefixes.length;

    if (indexes[0] >= 1) {
      suffix = `-${indexes[0] + 1}`;
    }

    return this.blobConstructor(prefix + this.prefixes[Math.floor(indexes[1])],
                                this.suffixes[Math.floor(indexes[2])] + suffix);
  }

  protected reduceNumber(num: Decimal): number {
    if (num.lte(1000)) {
      // 0 - 1000: increment by 1
      return num.toNumber();
    }
    // 1001 and above: previous number ^ 1.001
    return (Math.log10(num.log10()) - LOG3) / Math.log10(1.001) + 1000;
  }

  protected blobConstructor(prefix: string, suffix: string): string {
    return `:${prefix}blob${suffix}:`;
  }
}
