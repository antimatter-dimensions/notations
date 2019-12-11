import { Notation } from "../notation";
import Decimal from "break_infinity.js/break_infinity";
import { toSubscript } from "../utils";

export class OmegaNotation extends Notation {
  public get name(): string {
    return "Omega";
  }

  get greek(): string {
    return "βζλψΣΘΨω";
  }

  get infinite(): string {
    return "Ω";
  }

  public formatUnder1000(value: number): string {
    return this.formatDecimal(new Decimal(value));
  }

  public formatDecimal(value: Decimal): string {
    const step = Decimal.floor(value.div(1000));
    const omegaAmount = Decimal.floor(step.div(this.greek.length));
    let lastLetter = this.greek[step.toNumber() % this.greek.length] + toSubscript(value.toNumber() % 1000);
    const beyondGreekArrayBounds = this.greek[step.toNumber() % this.greek.length] === undefined;
    if (beyondGreekArrayBounds || step.toNumber() > Number.MAX_SAFE_INTEGER) {
      lastLetter = "ω";
    }
    const omegaOrder = Decimal.log(value, 8000);
    if (omegaAmount.equals(0)) {
      return lastLetter;
    } else if (omegaAmount.gt(0) && omegaAmount.lte(3)) {
      const omegas = [];
      for (let i = 0; i < omegaAmount.toNumber(); i++) {
        omegas.push("ω");
      }
      return omegas.join("^") + "^" + lastLetter;
    } else if (omegaAmount.gt(3) && omegaAmount.lt(10)) {
      return "ω(" + omegaAmount.toFixed(0) + ")^" + lastLetter;
    } else if (omegaOrder < 3) {
      return "ω(" + this.formatDecimal(omegaAmount) + ")^" + lastLetter;
    } else if (omegaOrder < 6) {
      return "ω(" + this.formatDecimal(omegaAmount) + ")";
    } else {
      const val = Decimal.pow(8000, omegaOrder % 1);
      const orderStr = omegaOrder < 100
        ? Math.floor(omegaOrder).toFixed(0)
        : this.formatDecimal(Decimal.floor(omegaOrder));
      return "ω[" + orderStr + "](" + this.formatDecimal(val) + ")";
    }
  }
}
