import { BlobsNotation } from "./blobs";
import Decimal from "break_infinity.js";

export class BlobsShortNotation extends BlobsNotation {
  public get name(): string {
    return "Blobs (Short)";
  }

  protected get prefix_negative(): string {
    return "un";
  }

  protected blobify(num: Decimal): string {
    let prefix = "", suffix = "";
    let number = this.reduceNumber(num.abs());
    if (num.sign() === -1) {
      prefix = this.prefix_negative;
      // To allow the combination :notlikeblob: to appear
      number = Math.max(0, number - 1);
    }

    const indexes = [0, 0];

    indexes[1] = number % this.suffixes.length;
    indexes[0] = (number - indexes[1]) / this.suffixes.length;

    if (indexes[0] >= 1) {
      suffix = `-${indexes[0] + 1}`;
    }

    return this.blobConstructor(prefix, this.suffixes[Math.floor(indexes[1])] + suffix);
  }

}
