import { Notation } from "./notation";
import Decimal from "break_infinity.js/break_infinity";
import { ScientificNotation } from "./scientific";

// https://en.wikipedia.org/wiki/Lion-Eating_Poet_in_the_Stone_Den
const JPNNOT_SUFFIXES = ['', '万', '億', '兆', '京', '垓', '秭', '穣', '溝', '澗', '正', '載', '極', '恒河沙', '阿僧祇', '那由他', '不可思議', '無量大数'];
const scientific = new ScientificNotation();

export class JapaneseNotation extends Notation {
public get name(): string {
    return "Japanese";
  }

  public get infinite(): string {
    return "無限大";
  }

  public formatUnder1000(value: number): string {
    return this.jpnNotation(new Decimal(value));
  }

  public formatDecimal(value: Decimal, places: number): string {
    if (value.exponent < 72){
      return this.jpnNotation(value);
    }

    else if (value.exponent < 1e72) {
      return value.mantissa.toFixed(3) + '×10の' + this.jpnNotation(new Decimal(value.exponent)) + '乗';
    }

    else {
      return scientific.formatDecimal(value, places);
    }
  }

  private getSuffix(x: number): string {
    return JPNNOT_SUFFIXES[x];
  }

  private jpnNotation(value: Decimal): string {
    let exponentLast = Math.floor(value.exponent / 4);
    let mantissa = Decimal.times(Decimal.pow(10, value.exponent % 4), value.mantissa).toFixed(4);
    let integerPart = Decimal.floor(mantissa);
    let subExponent = Decimal.times(Decimal.minus(mantissa, integerPart), 10000);

    let money_str = "" + integerPart + this.getSuffix(exponentLast);

    if (exponentLast >= 1 && subExponent.neq(0)){
      money_str += subExponent + this.getSuffix(exponentLast-1);
    }

    return money_str;
  }
}
