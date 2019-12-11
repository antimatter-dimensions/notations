import { Notation } from "../notation";
import Decimal from "break_infinity.js/break_infinity";

const JPNNOT_SUFFIXES = [
  '', '万', '億', '兆', '京', '垓', '秭',
  '穣', '溝', '澗', '正', '載', '極',
  '恒河沙', '阿僧祇', '那由他', '不可思議', '無量大数'
];

export class JapaneseNotation extends Notation {
  public get name(): string {
    return "Japanese";
  }

  public get infinite(): string {
    return "無限";
  }

  public formatDecimal(value: Decimal, places: number): string {
    if (value.exponent < 72){
      return this.jpnNotation(value);
    }

    else {
      return value.mantissa.toFixed(places) + '×10の' + this.jpnNotation(new Decimal(value.exponent)) + '乗';
    }
  }

  private getSuffix(x: number): string {
    return JPNNOT_SUFFIXES[x];
  }

  private jpnNotation(value: Decimal): string {
    const exponentLast = Math.max(0, Math.floor(value.exponent / 4));
    const mantissa = Decimal.times(Decimal.pow(10, value.exponent - 4 * exponentLast), value.mantissa).toFixed(4);
    const integerPart = Decimal.floor(mantissa);
    const subExponent = Decimal.times(Decimal.minus(mantissa, integerPart), 10000);

    let money_str = "" + integerPart + this.getSuffix(exponentLast);

    if (exponentLast >= 1 && subExponent.neq(0)){
      money_str += subExponent + this.getSuffix(exponentLast-1);
    }

    return money_str;
  }
}
