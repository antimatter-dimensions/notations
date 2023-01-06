import Decimal from "break_infinity.js";
import { Notation } from "../notation";
import { formatMantissaWithExponent, formatMantissa } from "../utils";

export class CustomBaseNotation extends Notation {
  private readonly formatBase: number;

  private readonly digits: string;
  
  private readonly exponentBase: number;

  public constructor(digits: string, exponentBase: number) {
    if (digits.length < 2) {
      throw new Error("The supplied digits must contain at least 2 digits");
    }
    super();
    this.formatBase = digits.length;
    this.digits = digits;
    this.exponentBase = exponentBase;
  }

  public get name(): string {
    return "Custom Base";
  }
  
  public formatUnder1000(value: number, places: number): string {
    return formatMantissa(this.formatBase, this.digits)(value, places);
  }

  public formatDecimal(value: Decimal, places: number, placesExponent: number): string {
    return formatMantissaWithExponent(formatMantissa(this.formatBase, this.digits),
      (n, p) => this.formatExponent(n, p, (n2, _) => formatMantissa(this.formatBase, this.digits)(n2, 0)),
      this.exponentBase, 1, (x, _) => formatMantissa(this.formatBase, this.digits)(x, 0)
    )(value, places, placesExponent);
  }
}
