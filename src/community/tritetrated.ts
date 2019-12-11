import { Notation } from "../notation";
import Decimal from "break_infinity.js/break_infinity";

export class TritetratedNotation extends Notation {
  public get name(): string {
    return "Tritetrated";
  }

  public get infinite(): string {
    return 'Infinity';
  }

  public formatUnder1000(value: number): string {
    return this.tritetrated(new Decimal(value));
  }

  public formatDecimal(value: Decimal): string {
    return this.tritetrated(value);
  }

  private tritetrated(value: Decimal): string {
    let low = 0;
    let high = 16;
    while (high - low > 1e-7) {
      const mid = (low + high) / 2;
      if (Decimal.pow(mid, Math.pow(mid, mid)).lt(value)) {
        low = mid;
      } else {
        high = mid;
      }
    }
    return low.toFixed(4) + '↑↑3';
  }
}
