import { Notation } from "../notation";
import Decimal from "break_infinity.js/break_infinity";

/// Prefixes to use. Each prefix is 10000 times larger than the previous one.
const AsianNotPrefixes   = ["", "万", "亿", "兆", "京", "垓", "秭", "穰", "沟", "涧", "正", "载", "极"];
//  Trad. Chinese          ["", "萬", "億", "兆", "京", "垓", "秭", "穰", "溝", "澗", "正", "載", "極"];
//  Simp. Chinese          ["", "万", "亿", "兆", "京", "垓", "秭", "穰", "沟", "涧", "正", "载", "极"];
//  Japanese / Korean      ["", "万", "億", "兆", "京", "垓", "秭", "穣", "溝", "澗", "正", "載", "極"];

/// Digits (0-9) to use.
const AsianNotDigits     = ["〇", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
//  Normal                 ["〇", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
//  Financial              ["零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"];

/// Places to use inbetween prefixes. Each place is 10 times larger than the previous one.
const AsianNotPlaces     = ["", "十", "百", "千"];
//  Normal                 ["", "十", "百", "千"];
//  Financial              ["", "拾", "佰", "仟"];


export class AsianNotation extends Notation {
  public get name(): string {
    return "Asian";
  }

  public get infinite(): string {
    return "無窮";
  }

  public formatDecimal(value: Decimal): string {
    if (value.exponent < 4)
      return getUnder10000Value(value.toNumber());
    
    if (value.exponent < 52)
      return getAbove10000Value(value);
      
    const replacement = new Decimal(Math.floor(value.exponent / 48));
    if (replacement < 6)
      return getAbove1e48Value(value.div("1e" + (replacement * 48)))
        + AsianNotPrefix[12].padStart(replacement, AsianNotPrefix[12]);
    
    return getAbove1e48Value(value.div("1e" + (replacement * 48)))
      + "(" + formatDecimal(replacement) + ")" + AsianNotPrefix[12];
  }
  
  private getAbove1e48Value(value: Decimal): string {
      const exp = Math.floor(value.exponent / 4) * 4;
      const man = (value.mantissa * Math.pow(10, value.exponent - exp));
      return getUnder10000WithPlacesValue(man) + AsianNotPrefixes[exp / 4]
  }

  private getAbove10000Value(value: Decimal): string {
      const exp = Math.floor(value.exponent / 4) * 4;
      const man = Math.floor(value.mantissa * Math.pow(10, value.exponent - exp));
      const manb = Math.floor(value.mantissa * Math.pow(10, value.exponent - exp + 4)) % 10000;
      return getUnder10000Value(man) + AsianNotPrefixes[exp / 4] + 
        ((manb > 0) ? (getUnder10000Value(manb) + AsianNotPrefixes[exp / 4 - 1]) : "");
  }
  
  private getUnder10000WithPlacesValue(value: number): string {
    return ((Math.floor(value / 1000 % 10) > 0) ? 
            (AsianNotDigits[Math.floor(value / 1000 % 10)] + AsianNotPlaces[3]) : "") + 
      ((Math.floor(value / 100 % 10) > 0) ? (AsianNotDigits[Math.floor(value / 100 % 10)] + AsianNotPlaces[2]) : "") + 
      ((Math.floor(value / 10 % 10) == 1) ? AsianNotPlaces[1] : "") + 
      ((Math.floor(value / 10 % 10) > 1) ? (AsianNotDigits[Math.floor(value / 10 % 10)] + AsianNotPlaces[1]) : "") + 
      ((Math.floor(value) % 10 > 0) ? AsianNotDigits[Math.floor(value) % 10] : "") +
      (value > 1 ? AsianNotDigits[0] : "") + "點" + AsianNotDigits[Math.floor(value * 10) % 10]
      + AsianNotDigits[Math.floor(value * 100) % 10] + AsianNotDigits[Math.floor(value * 1000) % 10];
  }

  private getUnder10000Value(value: number): string {
    return ((Math.floor(value / 1000 % 10) > 0) ? 
            (AsianNotDigits[Math.floor(value / 1000 % 10)] + AsianNotPlaces[3]) : "") + 
      ((Math.floor(value / 100 % 10) > 0) ? (AsianNotDigits[Math.floor(value / 100 % 10)] + AsianNotPlaces[2]) : "") + 
      ((Math.floor(value / 10 % 10) == 1) ? AsianNotPlaces[1] : "") + 
      ((Math.floor(value / 10 % 10) > 1) ? (AsianNotDigits[Math.floor(value / 10 % 10)] + AsianNotPlaces[1]) : "") + 
      ((Math.floor(value) % 10 > 0) ? AsianNotDigits[Math.floor(value) % 10] : "") +
      (value > 1 ? AsianNotDigits[0] : "");
  }
}
