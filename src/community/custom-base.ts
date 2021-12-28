import Decimal from "break_infinity.js";
import { Notation } from "../notation";
import { formatMantissaWithExponent, formatMantissa } from "../utils";

export class CustomBaseNotation extends Notation {
  private readonly formatBase: number;

  private readonly digits: string;
  
  private readonly exponentBase: number;
  
  private readonly useLogIfExponentIsFormatted: boolean;

  public constructor(digits: string, exponentBase: number, useLogIfExponentIsFormatted: boolean) {
    if (digits.length < 2) {
      throw new Error("The supplied digits must contain at least 2 digits");
    }
    super();
    this.formatBase = digits.length;
    this.digits = digits;
    this.exponentBase = exponentBase;
    this.useLogIfExponentIsFormatted = useLogIfExponentIsFormatted;
  }

  public get name(): string {
    return "Custom Base";
  }
  
  public formatUnder1000(value: number, places: number): string {
    return formatMantissa(this.formatBase, this.digits)(value, places);
  }

  public formatDecimal(value: Decimal, places: number): string {
    return formatMantissaWithExponent(formatMantissa(this.formatBase, this.digits),
    (n, p) => this.formatExponent(n, p, (n, _) => formatMantissa(this.formatBase, this.digits)(n, 0)),
    this.exponentBase, 1, this.useLogIfExponentIsFormatted)(value, places);
  }
}
