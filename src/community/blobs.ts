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
  "think", "wave", "morning", "night", "hug", "nom", "shrug", "pat", "sadpat", "ble",
  "peek", "sleep", "doubt",
  // Emotions
  "sad", "ping", "woke", "neutral", "angry", "cry", "blush",
  // Signs
  "yes", "no", "blobyes", "blobno", "maybe", "ok", "thanks", "bully", "nobully",
  // Objects
  "popcorn", "heart", "ban",
  // Variations
  "cat", "hugcat", "catping", "dog", "cheese", "chess", "creeper"
]
const LOG_SUFFIX = Math.log10(SUFFIXES.length);

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
    // 0 => 0, 1 => 1, 3 => 2, 7 => 3...
    let log = num.abs().add(1).log10() / LOG2;
    const pre = Math.floor(Math.log10(log) / LOG_SUFFIX);
    prefix += PREFIXES[pre % PREFIXES.length];
    if (pre >= PREFIXES.length) {
      suffix = `-${Math.floor(pre / 4) + 1}`;
    }
    log -= Math.pow(SUFFIXES.length, pre);
    const suf = Math.min(Math.floor(Math.log10(log) / LOG_SUFFIX), SUFFIXES.length - 1);
    suffix = SUFFIXES[suf] + suffix;
    return this.blobConstructor(prefix, suffix);
  }

  public blobConstructor(prefix: string, suffix: string) {
    return `:${prefix}blob${suffix}:`;
  }
}
