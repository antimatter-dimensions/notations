import Decimal, { DecimalSource } from "break_infinity.js/break_infinity";
import { Settings } from "./settings";
import { formatWithCommas } from "./utils";

export abstract class Notation {
  public abstract get name(): string;

  public format(value: DecimalSource, places: number, placesUnder1000: number): string {
    if (typeof value === "number" && !Number.isFinite(value)) {
      return this.infinite;
    }

    const decimal = Decimal.fromValue_noAlloc(value);

    if (decimal.exponent < 3) {
      const number = decimal.toNumber();
      if (number === 0) {
        return decimal.sign() < 0
          ? this.formatNegativeDecimalUnderMinNumber(decimal.abs(), placesUnder1000)
          : this.formatDecimalUnderMinNumber(decimal, placesUnder1000);
      }
      return number < 0
        ? this.formatNegativeUnder1000(Math.abs(number), placesUnder1000)
        : this.formatUnder1000(number, placesUnder1000);
    }

    if (Settings.isInfinite(decimal)) {
      return this.infinite;
    }

    return decimal.sign() < 0
      ? this.formatNegativeDecimal(decimal.abs(), places)
      : this.formatDecimal(decimal, places);
  }

  public get infinite(): string {
    return "Infinite";
  }

  public formatNegativeDecimalUnderMinNumber(_value: Decimal, places: number): string {
    return this.formatUnder1000(0, places);
  }

  public formatDecimalUnderMinNumber(_value: Decimal, places: number): string {
    return this.formatUnder1000(0, places);
  }

  public formatNegativeUnder1000(value: number, places: number): string {
    return `-${this.formatUnder1000(value, places)}`;
  }

  public formatUnder1000(value: number, places: number): string {
    return value.toFixed(places);
  }

  public formatNegativeDecimal(value: Decimal, places: number): string {
    return `-${this.formatDecimal(value, places)}`;
  }

  abstract formatDecimal(value: Decimal, places: number): string;

  protected formatExponent(exponent: number): string {
    if (exponent < Settings.exponentCommas.min) {
      return exponent.toString();
    }
    if (this.showCommas(exponent)) {
      return formatWithCommas(exponent);
    }
    return this.formatDecimal(new Decimal(exponent), 3);
  }

  protected showCommas(exponent: number): boolean {
    return Settings.exponentCommas.show && exponent < Settings.exponentCommas.max;
  }
}
