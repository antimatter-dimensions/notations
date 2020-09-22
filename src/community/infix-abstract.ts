import { Notation } from "../notation";
import Decimal from "break_infinity.js";
import { fixMantissaOverflow } from '../utils';

export abstract class AbstractInfixNotation extends Notation {
  public get name(): string {
    return "Abstract Infix";
  }
  
  protected groupDigits = 3;
  
  protected abstract formatMantissa(digit: number): string;
  protected abstract formatExponent(digit: number): string;
  
  private nextSeparatorExponent(e: number) {
    // Get the next exponent (going down, so the highest exponent lower than e)
    // such that there is a separator at that exponent.
    return e - e % (e < this.groupDigits ? 3 : this.groupDigits);
  }
  
  public formatDecimal(value: Decimal, places: number): string {
    return this.formatInfix(value, places);
  }

  public formatInfix(inputValue: Decimal, inputPlaces: number): string {
    let places = Math.max(inputPlaces, this.groupDigits - 1);
    // Stop numbers starting with a lot of 9s from having those 9s rounded up,
    // by potentially adding 1 to the exponent.
    const value = fixMantissaOverflow(inputValue, places, 10, 1);
    places = Math.min(places, value.exponent);
    const mantissaString = value.mantissa.toFixed(places).replace('.', '');
    const result = [];
    let anyExponent = false;
    for (let i = 0; i < places + 1; i++) {
      result.push(this.formatMantissa(+mantissaString[i]));
      // Don't add anything for the exponent if we've already added an exponent
      // and this is the last digit.
      if (i == places && anyExponent) break;
      const currentExponent = value.exponent - i;
      if (currentExponent === 0) {
        result.push('.');
      } else {
        const sepExp = this.nextSeparatorExponent(currentExponent);
        if (currentExponent === sepExp) {
          result.push(this.formatExponent(currentExponent));
          anyExponent = true;
        } else if ((currentExponent - sepExp) % 3 === 0) {
          result.push(',');
        }
      }
    }
    return result.join('');
  }
}
