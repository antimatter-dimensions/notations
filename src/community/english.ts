import { EngineeringNotation } from "../engineering";
import Decimal from "break_infinity.js";
import { toFixedEngineering } from "../utils";

const UNITS = [
  "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine",
  "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"
];

const TENS = [
  "", "ten", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"
];

const PREFIXES = [
  ["", "un", "duo", "tre", "quattuor", "quin", "se", "septe", "octo", "nove"],
  ["", "deci", "viginti", "triginta", "quadraginta", "quinquaginta", "sexaginta", "septuaginta", "octoginta", "nonaginta"],
  ["", "centi", "ducenti", "trecenti", "quadringenti", "quingenti", "sescenti", "septingenti", "octingenti", "nongenti"]
];

const PREFIXES_2 = [
  "", "milli-", "micro-", "nano-", "pico-", "femto-", "atto-", "zepto-", "yocto-", "xono-",
  "veco-", "meco-", "dueco-", "treco-", "tetreco-", "penteco-", "hexeco-", "hepteco-", "octeco-", "enneco-",
  "icoso-", "meicoso-", "dueicoso-", "trioicoso-", "tetreicoso-",
  "penteicoso-", "hexeicoso-", "hepteicoso-", "octeicoso-", "enneicoso-",
  "triaconto-", "metriaconto-", "duetriaconto-", "triotriaconto-", "tetretriaconto-",
  "pentetriaconto-", "hexetriaconto-", "heptetriaconto-", "octtriaconto-", "ennetriaconto-",
  "tetraconto-", "metetraconto-", "duetetraconto-", "triotetraconto-", "tetretetraconto-",
  "pentetetraconto-", "hexetetraconto-", "heptetetraconto-", "octetetraconto-", "ennetetraconto-",
  "pentaconto-", "mepentaconto-", "duepentaconto-", "triopentaconto-", "tetrepentaconto-",
  "pentepentaconto-", "hexepentaconto-", "heptepentaconto-", "octepentaconto-", "ennepentaconto-",
  "hexaconto-", "mehexaconto-", "duehexaconto-", "triohexaconto-", "tetrehexaconto-",
  "pentehexaconto-", "hexehexaconto-", "heptehexaconto-", "octehexaconto-", "ennehexaconto-",
  "heptaconto-", "meheptaconto-", "dueheptaconto-", "trioheptaconto-", "tetreheptaconto-",
  "penteheptaconto-", "hexeheptaconto-", "hepteheptaconto-", "octeheptaconto-", "enneheptaconto-",
  "octaconto-", "meoctaconto-", "dueoctaconto-", "triooctaconto-", "tetreoctaconto-",
  "penteoctaconto-", "hexeoctaconto-", "hepteoctaconto-", "octeoctaconto-", "enneoctaconto-",
  "ennaconto-", "meennaconto-", "dueeennaconto-", "trioennaconto-", "tetreennaconto-",
  "penteennaconto-", "hexeennaconto-", "hepteennaconto-", "octeennaconto-", "enneennaconto-",
  "hecto-", "mehecto-", "duehecto-",
];

export class EnglishNotation extends EngineeringNotation {
  public get name(): string {
    return "English";
  }

  public get negativeInfinite(): string {
    return "an infinitely large negative number";
  }

  public get infinite(): string {
    return "an infinitely large positive number";
  }

  public formatNegativeVerySmallDecimal(value: Decimal, places: number): string {
    return `negative one ${this.formatDecimal(value.reciprocal(), places).replace(/ /g, "-").replace("--", "-")}th`;
  }

  public formatVerySmallDecimal(value: Decimal, places: number): string {
    return `one ${this.formatDecimal(value.reciprocal(), places).replace(/ /g, "-").replace("--", "-")}th`;
  }

  public formatNegativeUnder1000(value: number, places: number): string {
    return `negative ${this.formatDecimal(new Decimal(value), places)}`;
  }

  public formatUnder1000(value: number, places: number): string {
    return this.formatDecimal(new Decimal(value), places);
  }

  public formatNegativeDecimal(value: Decimal, places: number): string {
    return `negative ${this.formatDecimal(value, places)}`;
  }

  public formatDecimal(value: Decimal, places: number): string {
    // Format in the form of "one xth" when number is less than or equal 0.001.
    if (value.lte(0.001)) {
      return this.formatVerySmallDecimal(value, places);
    }

    const engineering = toFixedEngineering(value, places);
    const precision = Math.pow(10, -places);

    // Prevent 0.002 from being formatted as "two undefined" and alike.
    if (value.lte(0.01)) {
      return this.formatUnits(value.toNumber() + precision / 2, places);
    }

    // Calculate the actual mantissa and exponent.
    const ceiled = engineering.mantissa + precision / 2 >= 1000;
    const mantissa = (ceiled ? 1 : engineering.mantissa + precision / 2);
    const exponent = engineering.exponent + (ceiled ? 1 : 0);

    const unit = this.formatUnits(mantissa, places);
    const abbreviation = this.formatPrefixes(exponent);
    return `${unit} ${abbreviation}`;
  }

  private formatUnits(e: number, p: number): string {
    let ans = [];
    const origin = e;
    let precision = Math.pow(10, -p);
    // The hundred place.
    if (e >= 100) {
      const a = Math.floor(e / 100);
      ans.push(UNITS[a] + " hundred");
      e -= a * 100;
    }
    // The tens and units place. Because 11-19 in English is only one word this has to be separated.
    if (e < 20) {
      if (e >= 1 && ans.length > 0) ans.push("and");
      const a = Math.floor(e);
      ans.push(e < 1 && origin > 1 ? "" : UNITS[a]);
      e -= a;
    } else {
      if (ans.length > 0) ans.push("and");
      let a = Math.floor(e / 10);
      ans.push(TENS[a]);
      e -= a * 10;
      a = Math.floor(e);
      if (a != 0) {
        ans.push(UNITS[a]);
        e -= a;
      }
    }
    // Places after the decimal point.
    if (e >= Math.pow(10, -p) && p > 0) {
      ans.push("point");
      let a = 0;
      while (e >= precision && a < p) {
        ans.push(UNITS[Math.floor(e * 10)]);
        e = e * 10 - Math.floor(e * 10);
        precision *= 10;
        a++;
      }
    }
    return ans.filter(i => i !== "").join(" ");
  }

  private formatPrefixes(e: number): string {
      e = Math.floor(e / 3) - 1;
      // Quick returns.
      if (e <= 3) {
        return ["", "thousand", "million", "billion", "trillion"][e + 1];
      }
      // I don't know how to clean this please send help
      let index2 = 0;
      const prefix = [PREFIXES[0][e % 10]];
      while (e >= 10) {
        e = Math.floor(e / 10);
        prefix.push(PREFIXES[++index2 % 3][e % 10]);
      }
      index2 = Math.floor(index2 / 3);
      while (prefix.length % 3 !== 0) {
        prefix.push("");
      }
      let abbreviation = "";
      while (index2 >= 0) {
        if (prefix[index2 * 3] != "un" || prefix[index2 * 3 + 1] != "" || prefix[index2 * 3 + 2] != "" || index2 == 0) {
          let abb2 = prefix[index2 * 3 + 1] + prefix[index2 * 3 + 2];
          // Special cases.
          if (["tre", "se"].includes(prefix[index2 * 3]) && ["v", "t", "q"].includes(abb2.substr(0, 1))) {
            abb2 = "s" + abb2;
          }
          if (prefix[index2 * 3] == "se" && ["c", "o"].includes(abb2.substr(0, 1))) {
            abb2 = "x" + abb2;
          }
          if (["septe", "nove"].includes(prefix[index2 * 3]) && ["v", "o"].includes(abb2.substr(0, 1))) {
            abb2 = "m" + abb2;
          }
          if (["septe", "nove"].includes(prefix[index2 * 3]) && ["d", "c", "t", "q", "s"].includes(abb2.substr(0, 1))) {
            abb2 = "n" + abb2;
          }
          abbreviation += prefix[index2 * 3] + abb2;
        }
        if (prefix[index2 * 3] != "" || prefix[index2 * 3 + 1] != "" || prefix[index2 * 3 + 2] != "") {
          abbreviation += PREFIXES_2[index2];
        }
        index2--;
      }
      abbreviation = abbreviation.replace(/-$/, "");
      // Replacements from '.replace("unillion", "untillion")' to '.replace("trillion", "tretillion")' are made
      // because apparently 1e3006 is formatted as "one duotillion" and not like "one duillion" or "one billion".
      // Replacements after '.replace("quattuorillion", "quadrillion")' are the easiest way to prevent numbers like
      // 1e3016 from being formatted like "ten milli-quattuorillion" instead of "ten milli-quadrillion". Using only
      // "quadrillion" for 1e15 no longer works.
      return (abbreviation + "illion")
        .replace("i-illion", "illion")
        .replace("iillion", "illion")
        .replace("aillion", "illion")
        .replace("oillion", "illion")
        .replace("eillion", "illion")
        .replace("unillion", "untillion")
        .replace("duillion", "duotillion")
        .replace("trillion", "tretillion")
        .replace("quattuorillion", "quadrillion")
        .replace("quinillion", "quintillion")
        .replace("sillion", "sextillion")
        .replace("novillion", "nonillion");
  }
}
