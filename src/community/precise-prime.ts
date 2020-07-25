import { Notation } from "../notation";
import Decimal from "break_infinity.js";
import { toSuperscript } from "../utils";

// The maximum number we can reliably find prime factors for.
const MAX_INT = Number.MAX_SAFE_INTEGER;
const MAX_INT_DECIMAL = new Decimal(MAX_INT);
const MAX_INT_LOG_10 = Math.log10(MAX_INT);
// The maximum factor we consider.
const MAX_FACTOR = 10000;

export class PrecisePrimeNotation extends Notation {
  public get name(): string {
    return "Precise Prime";
  }

  public get infinite(): string {
    return "Primefinity?";
  }

  public formatUnder1000(value: number): string {
    return this.primify(new Decimal(value));
  }

  public formatDecimal(value: Decimal): string {
    return this.primify(value);
  }

  private primify(value: Decimal): string {
    // We take the number and do 1 of 4 things depending on how big it is.
    // If the number is less than 0, we primify its negation and add a minus sign
    // to the start.
    // If the number is smaller than maxIntDecimal, about 9e15, then we just
    // find the primes and format them.
    // If not we need a way of representing the number, using only primes of course.
    // So we derive an exponent that will keep the base under the maxInt, then
    // we derive prime factors for both and format them as (base)^(exponent).
    // If the number is greater than 1e(maxIntDecimal) (should never happen with
    // this number library), we need to again format it differently.
    // So we increase our stack size to three, and repeat the process above from
    // top down.
    if (value.lte(MAX_INT_DECIMAL)) {
      const floored = Math.floor(value.toNumber());
      if (floored === 0) {
        return "0";
      }
      if (floored === 1) {
        return "1";
      }
      return this.formatFromList(this.primesFromInt(floored));
    }
    let exp = value.log10() / MAX_INT_LOG_10;
    let base = Math.pow(MAX_INT, exp / Math.ceil(exp));
    if (exp <= MAX_INT) {
      return this.formatPowerTower([Math.round(base), Math.ceil(exp)]);
    }
    const exp2 = Math.log10(exp) / Math.log10(MAX_INT);
    const exp2Ceil = Math.ceil(exp2);
    exp = Math.pow(MAX_INT, exp2 / exp2Ceil);
    base = Math.pow(MAX_INT, exp / Math.ceil(exp));
    return this.formatPowerTower([Math.round(base), Math.ceil(exp), exp2Ceil]);
  }

  private maybeParenthesize(x: string, b: boolean): string {
    return b ? `(${x})` : x;
  }

  private formatPowerTower(exps: number[]): string {
    const factorizations = exps.map(x => this.primesFromInt(x));
    const superscriptLastExponent = factorizations[exps.length - 1].length === 1;
    const parenthesize = factorizations.map(
      (x, i) => x[0] !== x[x.length - 1]
        || (i === exps.length - 2 && x.length > 1 && superscriptLastExponent)
    )
    const formattedExps = factorizations.map(
      (x, i) => this.maybeParenthesize(
        (i === exps.length - 1 && superscriptLastExponent)
          ? toSuperscript(x[0]) : this.formatFromList(x),
        parenthesize[i]
      )
    )
    if (superscriptLastExponent) {
      const superscript = formattedExps.pop();
      formattedExps[exps.length - 2] += superscript;
    }
    return formattedExps.join("^");
  }

  private formatFromList(factors: number[]): string {
    // Formats an array of prime numbers such that all like pairs are combined,
    // they are then raised to an exponent signifying how many times the value apears.
    // Finally multiplication signs are put between all values.
    const out = [];
    let last = 0;
    let count = 0;
    for (const i of factors) {
      if (i === last) {
        count++;
      } else {
        if (last > 0) {
          if (count > 1) {
            out.push(`${last}${toSuperscript(count)}`);
          } else {
            out.push(last);
          }
        }
        last = i;
        count = 1;
      }
    }
    if (count > 1) {
      out.push(`${last}${toSuperscript(count)}`);
    } else {
      out.push(last);
    }
    return out.join("\u00D7");
  }

  private primesFromInt(num: number): number[] {
    let n = num;
    const l = [];
    for (const k of [2, 3]) {
      for (; n % k === 0; n /= k) {
        l.push(k);
      }
    }

    const lim = Math.min(MAX_FACTOR, Math.floor(Math.sqrt(n)));

    // All primes > 3 are of the form 6+-1
    for (let a = 5; a <= lim && a < n;) {
      for (; n % a == 0; n /= a) {
        l.push(a);
      }
      a += 2;
      for (; n % a == 0; n /= a) {
        l.push(a);
      }
      a += 4;
    }
    if (n > 1) {
      l.push(n);
    }
    return l;
  }
}
