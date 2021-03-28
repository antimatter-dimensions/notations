import type Decimal from "break_infinity.js";
import { Notation } from "../notation";
import { ScientificNotation } from "../scientific";

const scientific = new ScientificNotation();

const CANCER = ["🎂", "🎄", "💀", "👪", "🌈", "💯", "🎃", "💋", "😂", "🌙"];

export class CoronavirusNotation extends Notation {
  public get name(): string {
    return "Coronavirus";
  }

  public formatUnder1000(value: number, places: number): string {
    return this.infect(scientific.formatUnder1000(value, places));
  }

  public formatDecimal(value: Decimal, places: number): string {
    return this.infect(scientific.formatDecimal(value, places));
  }

  public infect(formatted: string): string {
    const characters = formatted.split("");
    const seenDigits: number[] = [];
    for (let i = 0; i < characters.length; i++) {
      if ("0123456789".includes(characters[i])) {
        if (seenDigits.map((x) => x % 5).includes(Number(characters[i]) % 5)) {
          const cancerIndex = seenDigits.map((x) => x % 5).indexOf(Number(characters[i]) % 5) +
            5 * ((Number(!seenDigits.includes(Number(characters[i]))) + i) % 2);
          characters[i] = CANCER[cancerIndex];
        } else {
          seenDigits.push(Number(characters[i]));
        }
      }
    }
    return characters.join("");
  }
}
