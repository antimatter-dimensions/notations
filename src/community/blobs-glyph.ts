import Decimal from "break_infinity.js";
import {BlobsNotation} from "./blobs";

// This notation works by using a font that replaces some characters with blobs.

// Number of characters in the alphabet, excluding infinity
const LEN = 23;
// This will be the first character of the alphabet.
const START = "\uE010";
const START_HEX = START.codePointAt(0) || 65;
const INFINITY = "\uE027"

const BLOBS: Array<string> = [];
for (let i = 0; i < LEN; i++) {
  const char = String.fromCharCode(START_HEX + i);
  BLOBS.push(char);
}


export class BlobsGlyphNotation extends BlobsNotation {
  public get name(): string {
    return "Blobs (Glyph)";
  }

  public get infinite(): string {
    // Because kaj thinks that blob distinction doesn't matter :blobthink:
    return `${INFINITY}`;
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
