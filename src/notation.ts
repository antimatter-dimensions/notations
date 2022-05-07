import Decimal from "break_infinity.js";
import type { DecimalSource } from "break_infinity.js";
import { Settings } from "./settings";
import { formatWithCommas, noSpecialFormatting, showCommas } from "./utils";

export abstract class Notation {
  public abstract get name(): string;

  public format(value: DecimalSource, places: number = 0, placesUnder1000: number = 0, placesExponent: number = places): string {
    if (typeof value === "number" && !Number.isFinite(value)) {
      return this.infinite;
    }

    const decimal = Decimal.fromValue_noAlloc(value);

    if (decimal.exponent < -300) {
      return decimal.sign() < 0
        ? this.formatVerySmallNegativeDecimal(decimal.abs(), placesUnder1000)
        : this.formatVerySmallDecimal(decimal, placesUnder1000);
    }

    if (decimal.exponent < 3) {
      const number = decimal.toNumber();
      return number < 0
        ? this.formatNegativeUnder1000(Math.abs(number), placesUnder1000)
        : this.formatUnder1000(number, placesUnder1000);
    }

    if (Settings.isInfinite(decimal.abs())) {
      return decimal.sign() < 0 ? this.negativeInfinite : this.infinite;
    }

    return decimal.sign() < 0
      ? this.formatNegativeDecimal(decimal.abs(), places, placesExponent)
      : this.formatDecimal(decimal, places, placesExponent);
  }

  public get negativeInfinite(): string {
    return `-${this.infinite}`;
  }

  public get infinite(): string {
    return "Infinite";
  }

  public formatVerySmallNegativeDecimal(value: Decimal, places: number): string {
    return `-${this.formatVerySmallDecimal(value, places)}`;
  }

  public formatVerySmallDecimal(value: Decimal, places: number): string {
    // We switch to very small formatting as soon as 1e-300 due to precision loss,
    // so value.toNumber() might not be zero.
    return this.formatUnder1000(value.toNumber(), places);
  }

  public formatNegativeUnder1000(value: number, places: number): string {
    return `-${this.formatUnder1000(value, places)}`;
  }

  public formatUnder1000(value: number, places: number): string {
    return value.toFixed(places);
  }

  public formatNegativeDecimal(value: Decimal, places: number, placesExponent: number): string {
    return `-${this.formatDecimal(value, places, placesExponent)}`;
  }

  abstract formatDecimal(value: Decimal, places: number, placesExponent: number): string;

  protected formatExponent(exponent: number, precision: number = Settings.exponentDefaultPlaces,
    specialFormat: (n: number, p: number) => string = ((n, _) => n.toString()),
    largeExponentPrecision: number = Math.min(2, precision)): string {
    // This is for log notation, which wants a digit of precision on all small exponents.
    if (noSpecialFormatting(exponent)) {
      return specialFormat(exponent, Math.max(precision, 1));
    }
    if (showCommas(exponent)) {
      // need this to use specialformat first
      return formatWithCommas(specialFormat(exponent, 0));
    }
    return this.formatDecimal(new Decimal(exponent), largeExponentPrecision, largeExponentPrecision);
  }
}
