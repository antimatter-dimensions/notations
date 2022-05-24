import Decimal from "break_infinity.js";
import type { DecimalSource } from "break_infinity.js";
import { Notation } from "../notation";
import { Settings } from "../settings";
import { fixMantissaOverflow } from "../utils";

export abstract class AbstractInfixNotation extends Notation {
  public name = "Abstract Infix";

  protected groupDigits = 3;

  protected canHandleZeroExponent = true;

  public formatDecimal(value: Decimal, places: number, _placesExponent: number): string {
    return this.formatInfix(
      value,
      places
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public format(value: DecimalSource, places = 0, _placesUnder1000 = 0, placesExponent = places): string {
    if (typeof value === "number" && !Number.isFinite(value)) {
      return this.infinite;
    }

    const decimal = Decimal.fromValue_noAlloc(value);
    

    if (Settings.isInfinite(decimal.abs())) {
      return decimal.sign() < 0 ? this.negativeInfinite : this.infinite;
    }

    return decimal.sign() < 0
      ? this.formatNegativeDecimal(
        decimal.abs(),
        places,
        placesExponent
      )
      : this.formatDecimal(
        decimal,
        places,
        placesExponent
      );
  }

  protected abstract formatMantissa (digit: number): string;

  protected abstract formatExponent (digit: number): string;

  protected formatInfix(inputValue: Decimal, inputPlaces: number): string {
    // Stop numbers starting with a lot of 9s from having those 9s rounded up,
    // by potentially adding 1 to the exponent.
    // This function is old and may be broken but TBH I don't care too much
    // about maintaining the infix notations right now, possibly at some point
    // this should be updated to the general sci handling method.
    const value = fixMantissaOverflow(
      inputValue,
      this.numberOfPlaces(
        inputValue,
        inputPlaces
      ),
      10,
      1
    );
    const places = this.numberOfPlaces(
      value,
      inputPlaces
    );
    const mantissaString = value.mantissa.toFixed(places).replace(
      ".",
      ""
    );
    const result = [];
    let anyExponent = false;
    if (value.exponent === -1) {
      if (this.canHandleZeroExponent) {
        result.push(this.formatExponent(0));
      } else {
        result.push(".");
      }
    }
    for (let i = 0; i < places + 1; i++) {
      result.push(this.formatMantissa(Number(mantissaString[i])));
      // Don't add anything for the exponent if we've already added an exponent
      // and this is the last digit.
      if (i === places && anyExponent) {
        break;
      }
      const currentExponent = value.exponent - i;
      if (currentExponent === 0 && !this.canHandleZeroExponent) {
        result.push(".");
      } else {
        const sepExp = this.nextSeparatorExponent(currentExponent);
        if (currentExponent === sepExp) {
          result.push(this.formatExponent(currentExponent));
          anyExponent = true;
        } else if ((currentExponent - sepExp) % 3 === 0) {
          result.push(",");
        }
      }
    }
    return result.join("");
  }

  private nextSeparatorExponent(e: number): number {
    // Get the next exponent (going down, so the highest exponent lower than e)
    // such that there is a separator at that exponent.
    const modulus = e >= 0 && e < this.groupDigits ? 3 : this.groupDigits;
    return e - (e % modulus + modulus) % modulus;
  }

  private numberOfPlaces(value: Decimal, places: number): number {
    const exp = value.exponent;
    let minPlaces = 0;
    if (exp >= 0) {
      minPlaces = Math.min(exp, exp < this.groupDigits ? 3 : this.groupDigits - 1);
    } else if (exp === -1) {
      minPlaces = 0;
    } else {
      minPlaces = exp - this.nextSeparatorExponent(exp);
    }
    return Math.max(places, minPlaces);
  }
}
