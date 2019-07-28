import { Notation } from "./notation";
import Decimal from "break_infinity.js/break_infinity";
import { formatWithCommas } from "./utils";

const ZALGO_CHARS = [
  "\u030D", "\u0336", "\u0353", "\u033F", "\u0489",
  "\u0330", "\u031A", "\u0338", "\u035A", "\u0337"
];

const HE_COMES = ["H", "E", " ", "C", "O", "M", "E", "S"];

function randomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export class ZalgoNotation extends Notation {
  public get name(): string {
    return "Zalgo";
  }

  public get infinite(): string {
    return HE_COMES
      .map((char) => char + randomElement(ZALGO_CHARS))
      .join("");
  }

  public formatUnder1000(value: number): string {
    return this.heComes(new Decimal(value));
  }

  public formatDecimal(value: Decimal): string {
    return this.heComes(value);
  }

  private heComes(value: Decimal): string {
    // Eternity seems to happen around e66666 antimatter, who would've thought? Scaled down to 1000.
    const scaled = value.plus(1).log10() / 66666 * 1000;
    const displayPart = Number(scaled.toFixed(2));
    const zalgoPart = Math.floor(Math.abs(Math.pow(2, 30) * (scaled - displayPart)));

    const displayChars = Array.from(formatWithCommas(displayPart));
    const zalgoIndices = Array.from(zalgoPart.toString() + scaled.toFixed(0));

    for (let i = 0; i < zalgoIndices.length; i++) {
      const zalgoIndex = parseInt(zalgoIndices[i], 10);
      const displayIndex = 37 * i % displayChars.length;
      displayChars[displayIndex] += ZALGO_CHARS[zalgoIndex];
    }

    return displayChars.join("");
  }
}
