import Decimal from "break_infinity.js";
import { Notation } from "./notation";

// This notation works by using a font that replaces some characters with blobs.

// Number of characters in the alphabet, excluding infinity
const LEN = 23;
// This will be the first character of the alphabet.
const START = "\uE010";
const START_HEX = START.codePointAt(0) || 65;
const INFINITY = "\uE027";

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
    // Because kaj thinks that blob distinction doesn't matter :blobthink:
    return `${INFINITY}`;
  }
  
  // Use default negative formatting; leave special negative formatting to the text-based notations.

  // IDK if this is ever relevant but it was here and I'm not going to be the one to remove it.
  public formatVerySmallDecimal(num: Decimal): string {
    return this.blobify(num);
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
    // 1001 and above: previous number ^ 1.001
    return (Math.log10(num.log10()) - LOG3) / Math.log10(1.001) + 1000;
  }
}
