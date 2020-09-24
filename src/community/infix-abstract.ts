import { Notation } from "../notation";
import type { DecimalSource } from "break_infinity.js";
import Decimal from "break_infinity.js";
import { fixMantissaOverflow } from "../utils";

export abstract class AbstractInfixNotation extends Notation {
  public name: string = "Abstract Infix";

  public formatDecimal(value: Decimal, places: number): string {
    return this.formatInfix(
      value,
      places
    );
  }

  public format(value: DecimalSource, places: number = 0, placesUnder1000: number = 0): string {
    if (typeof value === "number" && !Number.isFinite(value)) {
      return this.infinite;
    }

    const decimal = Decimal.fromValue_noAlloc(value);

    return decimal.sign() < 0
      ? this.formatNegativeDecimal(
        decimal.abs(),
        places
      )
      : this.formatDecimal(
        decimal,
        places
      );
  }

  protected groupDigits = 3;

  protected canHandleZeroExponent = true;

  protected abstract formatMantissa (digit: number): string;

  protected abstract formatExponent (digit: number): string;

  private nextSeparatorExponent(e: number): number {
    // Get the next exponent (going down, so the highest exponent lower than e)
    // such that there is a separator at that exponent.
    const modulus = e >= 0 && e < this.groupDigits ? 3 : this.groupDigits;
    return e - (e % modulus + modulus) % modulus;
  }

  private numberOfPlaces(value: Decimal, places: number): number {
    const exp = value.exponent;
    const rel = exp > 0 ? exp + 1 : -exp;
    return Math.max(
      places,
      Math.min( this.groupDigits, rel ) -1
    );
  }

  protected formatInfix(inputValue: Decimal, inputPlaces: number): string {
    // Stop numbers starting with a lot of 9s from having those 9s rounded up,
    // by potentially adding 1 to the exponent.
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
}
