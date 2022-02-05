import Decimal from "break_infinity.js";
import type { DecimalSource } from "break_infinity.js";
import { Settings } from "./settings";
import { formatWithCommas, noSpecialFormatting, showCommas } from "./utils";

export abstract class Notation {
  public abstract get name(): string;

  public get canHandleNegativePlaces(): boolean {
    return false;
  }

  public format(value: DecimalSource, rawPlaces: number = -1, rawPlacesUnder1000: number = -1): string {
    const places = this.canHandleNegativePlaces ? rawPlaces : Math.max(0, rawPlaces);
    const placesUnder1000 = this.canHandleNegativePlaces ? rawPlacesUnder1000 : Math.max(0, rawPlacesUnder1000);
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
      ? this.formatNegativeDecimal(decimal.abs(), places)
      : this.formatDecimal(decimal, places);
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

  public formatNegativeDecimal(value: Decimal, places: number): string {
    return `-${this.formatDecimal(value, places)}`;
  }

  abstract formatDecimal(value: Decimal, places: number): string;

  protected formatExponent(exponent: number, rawPrecision: number = Settings.exponentDefaultPlaces,
    specialFormat: (n: number, p: number) => string = ((n, _) => n.toString())): string {
    // This is because we're treating -1 as a sentinal default value. We also allow undefined,
    // for backwards compatibility in case anyone calls this directly.
    const precision = (rawPrecision === -1) ? Settings.exponentDefaultPlaces : rawPrecision;
    // This is for log notation, which wants a digit of precision on all small exponents.
    if (noSpecialFormatting(exponent)) {
      return specialFormat(exponent, Math.max(precision, 1));
    }
    if (showCommas(exponent)) {
      // need this to use specialformat first
      return formatWithCommas(specialFormat(exponent, 0));
    }
    return this.formatDecimal(new Decimal(exponent), precision);
  }
}
