import Decimal from "break_infinity.js";
import { OmegaNotation } from "./omega";
import { toSubscript } from "../utils";

export class OmegaShortNotation extends OmegaNotation {
  public get name(): string {
    return "Omega (Short)";
  }

  public formatDecimal(value: Decimal): string {
    const step = Decimal.floor(value.div(1000));
    const omegaAmount = Decimal.floor(step.div(this.greek.length));
    let lastLetter = this.greek[step.toNumber() % this.greek.length] + toSubscript(value.toNumber() % 1000);
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    const beyondGreekArrayBounds = this.greek[step.toNumber() % this.greek.length] === undefined;
    if (beyondGreekArrayBounds || step.toNumber() > Number.MAX_SAFE_INTEGER) {
      lastLetter = "ω";
    }
    const omegaOrder = Decimal.log(value, 8000);
    if (omegaAmount.equals(0)) {
      return lastLetter;
    } else if (omegaAmount.gt(0) && omegaAmount.lte(2)) {
      const omegas = [];
      for (let i = 0; i < omegaAmount.toNumber(); i++) {
        omegas.push("ω");
      }
      return `${omegas.join("^")}^${lastLetter}`;
    } else if (omegaAmount.gt(2) && omegaAmount.lt(10)) {
      return `ω(${omegaAmount.toFixed(0)})^${lastLetter}`;
    }
    const val = Decimal.pow(8000, omegaOrder % 1);
    const orderStr = omegaOrder < 100
      ? Math.floor(omegaOrder).toFixed(0)
      : this.formatDecimal(Decimal.floor(omegaOrder));
    return `ω[${orderStr}](${this.formatDecimal(val)})`;
  }
}
