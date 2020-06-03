import { Notation } from "../notation";
import Decimal from "break_infinity.js/break_infinity";

const theNumbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "50", "51", "52", "53", "54", "55", "56", "57", "58", "59", "60", "61", "62", "63", "64", "65", "66", "67", "68", "69"];
const LOG69 = Math.log(69);

export class HahaFunnyNotation extends Notation {
  public get name(): string {
    return "Funny Number";
  }

  public formatDecimal(value: Decimal): string {
    const log69 = Math.LN10 / LOG69 * value.log10();
    let wholeLog = Math.floor(log69);
    const decimalLog = log69 - wholeLog;
    const decimalLog4761 = Math.floor(decimalLog * 4761);
    const parts = [
      theNumbers[decimalLog4761 % 69],
      theNumbers[Math.floor(decimalLog4761 / 69)]
    ];
    while (wholeLog >= 69) {
      const remainder = wholeLog % 69;
      wholeLog = (wholeLog - remainder) / 69;
      parts.push(theNumbers[remainder]);
    }
    parts.push(theNumbers[wholeLog]);
    return parts.join("");
  }

  public get infinite(): string {
    return "69420";
  }

  public formatUnder1000(value: number): string {
    return this.formatDecimal(new Decimal(value));
  }
}
