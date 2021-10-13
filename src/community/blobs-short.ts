import { BlobsNotation } from "./blobs";
import Decimal from "break_infinity.js";

const EMPTY = "";
const NEGATIVE = "un";
const INFINITY = "finity";
const SUFFIXES = [EMPTY, "think", "wave", "hug", "nom", "sad", "pats", "yes", "no", "heart", "sleep"];

export class BlobsShortNotation extends BlobsNotation {
  public get name(): string {
    return "Blobs (Short)";
  }

  public get negativeInfinite(): string {
    return this.blobConstructor(NEGATIVE, INFINITY);
  }

  public get infinite(): string {
    return this.blobConstructor(EMPTY, INFINITY);
  }

  protected blobify(num: Decimal): string {
    let prefix = "", suffix = "";
    let number = this.reduceNumber(num.abs());
    if (num.sign() === -1) {
      prefix = NEGATIVE;
      // To allow the combination :notlikeblob: to appear
      number = Math.max(0, number - 1);
    }

    const indexes = [0, 0];

    indexes[1] = number % SUFFIXES.length;
    indexes[0] = (number - indexes[1]) / SUFFIXES.length;

    if (indexes[0] >= 1) {
      suffix = `-${indexes[0] - 1}`;
    }

    return this.blobConstructor(prefix, SUFFIXES[Math.floor(indexes[1])] + suffix);
  }
  
}
