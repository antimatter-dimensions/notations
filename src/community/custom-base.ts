import Decimal from "break_infinity.js";
import { Notation } from "../notation";
import { formatWithCommas } from "../utils";

export class CustomBaseNotation extends Notation {
  private base: number;
  private digits: string;
  
  constructor(digits: string) {
    if (digits.length < 2) {
      throw new Error("The supplied digits must contain at least 2 digits");
    }
    super();
    this.base = digits.length;
    this.digits = digits;
  }
  
  public get name(): string {
    return "Custom Base";
  }
  
  public formatUnder1000(valueIn: number, places: number): string {
    let value = Math.round(valueIn * Math.pow(this.base, places));
    const digits = [];
    while (value > 0) {
      digits.push(this.digits[value % this.base])
      value = Math.floor(value / this.base);
    }
    let result = digits.reverse().join("");
    if (places > 0) {
      result = result.padStart(places + 1, "0");
      result = result.slice(0, -places) + "." + result.slice(-places);
    }
    return result;
  }
  
  public formatExponent(exponent: number): string {
    if (this.noSpecialFormatting(exponent)) {
      return this.formatUnder1000(exponent, 0);
    }
    if (this.showCommas(exponent)) {
      return formatWithCommas(this.formatUnder1000(exponent, 0));
    }
    return this.formatDecimal(new Decimal(exponent), Math.floor(Decimal.log(1000, this.base)));
  }

  public formatDecimal(value: Decimal, places: number): string {
    let exponent = Math.floor(value.log(this.base));
    let mantissa = value.div(Decimal.pow(this.base, exponent)).toNumber();
    if (mantissa >= this.base - Math.pow(this.base, -places) / 2) {
      mantissa = 1;
      exponent++;
    }
    return `${this.formatUnder1000(mantissa, places)}e${this.formatExponent(exponent)}`;
  }
}
