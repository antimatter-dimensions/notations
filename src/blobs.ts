import Decimal from "break_infinity.js";
import { Notation } from "./notation";

// This notation works by using a font that replaces some characters with blobs

// Number of characters in the alphabet, excluding infinity and negative
const LEN = 23;
// This will be the first character of the alphabet
const START = "\uE010";
const START_HEX = START.codePointAt(0) || 65;
const INFINITY = "\uE027";
const NEGATIVE = "\uE028";

const BLOBS: Array<string> = [];
for (let i = 0; i < LEN; i++) {
  const char = String.fromCharCode(START_HEX + i);
  BLOBS.push(char);
}

// Important constant for reduceNumber method (due to double log being used starting at 1000)
const LOG3 = Math.log10(3);


export class BlobsNotation extends Notation {
  public get name(): string {
    return "Blobs";
  }

  public get infinite(): string {
    return `${INFINITY}`;
  }

  public get negativeInfinite(): string {
    return `${NEGATIVE}${INFINITY}`;
  }

  public formatNegativeUnder1000(num: number): string {
    return `${NEGATIVE}${this.blobify(new Decimal(num - 1))}`
  }

  public formatNegativeDecimal(num: Decimal): string {
    return `${NEGATIVE}${this.blobify(num.minus(1))}`
  }

  public formatUnder1000(num: number): string {
    return this.blobify(new Decimal(num));
  }

  public formatDecimal(num: Decimal): string {
    return this.blobify(num);
  }

  protected blobify(num: Decimal): string {
    const number = this.reduceNumber(num.abs());
    if (number < LEN) {
      return BLOBS[Math.floor(number)];
    }
    if (Math.floor(number / LEN) < LEN + 1) {
      return BLOBS[Math.floor(number / LEN) - 1] + BLOBS[Math.floor(number % LEN)] ;
    }
    return this.blobify(Decimal.floor(number / LEN - 1)) + BLOBS[Math.floor(number % LEN)];
  }

  protected reduceNumber(num: Decimal): number {
    if (num.lte(1000)) {
      // 0 - 1000: increment by 1
      return num.toNumber();
    }
    // 1001 and above: previous number ^ 1.0002
    return (Math.log10(num.log10()) - LOG3) / Math.log10(1.0002) + 1000;
  }
}
