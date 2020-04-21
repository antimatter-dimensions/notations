import { Notation } from "../notation";
import Decimal from "break_infinity.js/break_infinity";

/// Prefixes to use. Each prefix is 10000 times larger than the previous one.
const ChineseNotPrefixes   = ["", "万", "亿", "兆", "京", "垓", "秭", "穰", "沟", "涧", "正", "载", "极"];
//  Trad. Chinese          ["", "萬", "億", "兆", "京", "垓", "秭", "穰", "溝", "澗", "正", "載", "極"];
//  Simp. Chinese          ["", "万", "亿", "兆", "京", "垓", "秭", "穰", "沟", "涧", "正", "载", "极"];
//  Japanese / Korean      ["", "万", "億", "兆", "京", "垓", "秭", "穣", "溝", "澗", "正", "載", "極"];

/// Digits (0-9) to use.
const ChineseNotDigits     = ["〇", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
//  Normal                 ["〇", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
//  Financial              ["零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"];

/// Places to use inbetween prefixes. Each place is 10 times larger than the previous one.
const ChineseNotPlaces     = ["", "十", "百", "千"];
//  Normal                 ["", "十", "百", "千"];
//  Financial              ["", "拾", "佰", "仟"];


export class ChineseNotation extends Notation {
  public get name(): string {
    return "Chinese";
  }

  public get infinite(): string {
    return "無窮";
  }
  
  public formatUnder1000(value: number): string {
    return this.formatUnder10000(value);
  }

  public formatDecimal(value: Decimal): string {
    return this.formatChinese(value);
  }
  
  private formatChinese(value: Decimal): string {
    if (value.exponent < 4) {
      return this.formatUnder10000(value.toNumber());
    }
    
    if (value.exponent < 52) {
      return this.formatAbove10000(value);
    }
      
    const replacement = Math.floor(value.exponent / 48);
    
    if (replacement < 6) {
      return this.formatAbove1e48(value.div(Decimal.pow(1e48, replacement))) +
        ChineseNotPrefixes[12].repeat(replacement);
    }
    
    return this.formatAbove1e48(value.div(Decimal.pow(1e48, replacement)))
      + "(" + this.formatChinese(new Decimal(replacement)) + ")" + ChineseNotPrefixes[12];
  }
  
  private formatAbove1e48(value: Decimal): string {
      const exp = Math.floor(value.exponent / 4) * 4;
      const man = (value.mantissa * Math.pow(10, value.exponent - exp));
      return this.formatUnder10000WithPlaces(man) + ChineseNotPrefixes[exp / 4]
  }

  private formatAbove10000(value: Decimal): string {
      const exp = Math.floor(value.exponent / 4) * 4;
      const man = Math.floor(value.mantissa * Math.pow(10, value.exponent - exp));
      const manb = Math.floor(value.mantissa * Math.pow(10, value.exponent - exp + 4)) % 10000;
      return this.formatUnder10000(man) + ChineseNotPrefixes[exp / 4] + 
        ((manb > 0) ? (this.formatUnder10000(manb) + ChineseNotPrefixes[exp / 4 - 1]) : "");
  }
  
  private formatUnder10000WithPlaces(value: number): string {
    return this.formatUnder1000(value) + "點" +
      [1, 2, 3].map(x => ChineseNotDigits[Math.floor(value * Math.pow(10, x)) % 10]).join('');
  }

  private formatUnder10000(value: number): string {
    return [3, 2, 1, 0].map(function (x) {
      const digit = Math.floor(value / Math.pow(10, x)) % 10;
      if (digit === 0) {
        return "";
      }
      if (digit === 1 && x > 0) {
        return ChineseNotPlaces[x];
      }
      return ChineseNotDigits[digit] + ChineseNotPlaces[x];
    }).join("") || ChineseNotDigits[0];
  }
}
