import { Notation } from "../notation";
import Decimal from "break_infinity.js";

const LOG2 = Math.log10(2);
const EMPTY = "";
const NEGATIVE = "notlike";
const INFINITY = "finity";
const PREFIXES = [EMPTY, "big", "mega", "giga", "omega"];
const SUFFIXES = [
  // Normal
  EMPTY,
  // Actions
  // "ble" stands for "blobble"
  "think", "wave", "morning", "night", "hug", "hugcat", "nom", "shrug", "pat", "sadpat", "ble",
  "peek", "sleep", "doubt",
  // Emotions
  "sad", "ping", "woke", "neutral", "angry", "cry", "blush",
  // Signs
  "yes", "no", "blobyes", "blobno", "maybe", "ok", "thanks", "bully", "nobully",
  // Objects
  "popcorn", "heart", "ban",
  // Variations
  "cat", "catping", "cheese", "chess", "creeper", "dog"
];

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
    if (num.sign() === -1) {
      prefix = NEGATIVE;
    }

    // const exp = Math.floor(num.abs().add(1).log10() / LOG2);
    // let pre, suf;
    // // The exponent is converted to base X, where X is the size of suffixes.
    // // The numerical prefix is the number of digits of converted num, minus one.
    // // The numerical suffix is the first digit of converted num.
    //
    // if (exp === 0) {
    //   pre = 0;
    //   suf = 0;
    // } else {
    //   pre = Math.floor(Math.log10(exp) / Math.log10(SUFFIXES.length));
    //
    //   if (pre === 0) {
    //     suf = exp;
    //   } else {
    //     suf = Math.floor(exp / Math.pow(SUFFIXES.length, pre));
    //   }
    // }
    //
    // if (pre >= PREFIXES.length) {
    //   suffix = `-${Math.floor(pre / 4) + 1}`;
    // }

    const exp = Math.floor(num.abs().add(1).log10() / LOG2);
    const base = PREFIXES.length * SUFFIXES.length;
    let size, pre, suf;
    // The exponent is converted to base X, where X is the number of prefixes * suffixes
    // The numerical prefix and suffixes are based on the size of converted number.
    // -X is added to represent the number of digits of converted number, minus 1.

    if (exp === 0) {
      size = 0;
      pre = 0;
      suf = 0;
    } else {
      size = Math.floor(Math.log10(exp) / Math.log10(base));
      let digit = Math.floor(exp / Math.pow(base, size));
      pre = Math.floor(digit / SUFFIXES.length);
      suf = digit - pre * SUFFIXES.length;
    }

    if (size > 0) {
      suffix = `-${size + 1}`;
    }

    return this.blobConstructor(prefix + PREFIXES[pre], SUFFIXES[suf] + suffix);
  }

  public blobConstructor(prefix: string, suffix: string) {
    return `:${prefix}blob${suffix}:`;
  }
}
