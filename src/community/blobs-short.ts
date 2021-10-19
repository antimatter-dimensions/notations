import { BlobsNotation } from "./blobs";
import Decimal from "break_infinity.js";

export class BlobsShortNotation extends BlobsNotation {
  public get name(): string {
    return "Blobs (Short)";
  }

  protected get prefixNegative(): string {
    return "un";
  }

  protected blobify(num: Decimal): string {
    let prefix = "", suffix = "";
    let number = this.reduceNumber(num.abs());
    if (num.sign() === -1) {
      prefix = this.prefixNegative;
      // To allow the combination :unblob: to appear
      number = Math.max(0, number - 1);
    }
    
    const indexes = [
      Math.floor(number / this.suffixes.length),
      number % this.suffixes.length
    ];

    if (indexes[0] >= 1) {
      suffix = `-${indexes[0] + 1}`;
    }

    return this.blobConstructor(prefix, this.suffixes[Math.floor(indexes[1])] + suffix);
  }

}
