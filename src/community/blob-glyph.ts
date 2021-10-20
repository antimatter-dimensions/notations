import Decimal from "break_infinity.js";
import {BlobsNotation} from "./blobs";

// This notation works by using a font that replaces some characters with blobs.

// Minimum value is 3
const LEN = 10;
// This will be the first character of the alphabet
const START = "A";
const START_HEX = START.codePointAt(0) || 65;

const BLOBS: Array<string> = [];
for (let i = 0; i < LEN; i++) {
  const hex = String.fromCharCode(START_HEX + i);
  BLOBS.push(hex);
}


export class BlobGlyphNotation extends BlobsNotation {
  public get name(): string {
    return BLOBS[0];
  }

  public get infinite(): string {
    return `${BLOBS[0]} ${BLOBS[0]}`;
  }

  protected blobify(num: Decimal): string {
    let number = this.reduceNumber(num.abs());
    if (number < LEN) {
      return BLOBS[Math.floor(number)];
    }
    if (Math.floor(number / LEN) < LEN + 1) {
      return BLOBS[Math.floor(number / LEN) - 1] + BLOBS[Math.floor(number % LEN)] ;
    }
    return this.blobify(Decimal.floor(number / LEN - 1)) + BLOBS[Math.floor(number % LEN)]
  }
}
