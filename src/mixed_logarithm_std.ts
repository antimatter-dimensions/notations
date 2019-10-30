import { Notation } from "./notation";
import { StandardNotation } from "./standard";
import Decimal from "break_infinity.js/break_infinity";

const standard = new StandardNotation();

export class MLogStdNotation extends Notation {
  public get name(): string {
    return "Mixed Logarithm (Standard notation Exponent)";
  }

  public formatDecimal(value: Decimal, places: number): string {
    const l = new Decimal(value.log10());

    if (l.exponent >= 5) {
      return `e${standard.formatDecimal(l, places)}`;
    }
    else{
      return `e${l.toFixed(places)}`;
    }
  }
}
