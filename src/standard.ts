import { EngineeringNotation } from "./engineering";
import Decimal from "break_infinity.js";
import { toFixedEngineering } from "./utils";

const ABBREVIATIONS = [
  "", "K", "M", "B", "T", "Qa", "Qt", "Sx", "Sp", "Oc", "No", "Dc", "UDc", "DDc",
  "TDc", "QaDc", "QtDc", "SxDc", "SpDc", "ODc", "NDc", "Vg", "UVg", "DVg", "TVg",
  "QaVg", "QtVg", "SxVg", "SpVg", "OVg", "NVg", "Tg", "UTg", "DTg", "TTg", "QaTg",
  "QtTg", "SxTg", "SpTg", "OTg", "NTg", "Qd", "UQd", "DQd", "TQd", "QaQd", "QtQd",
  "SxQd", "SpQd", "OQd", "NQd", "Qi", "UQi", "DQi", "TQi", "QaQi", "QtQi", "SxQi",
  "SpQi", "OQi", "NQi", "Se", "USe", "DSe", "TSe", "QaSe", "QtSe", "SxSe", "SpSe",
  "OSe", "NSe", "St", "USt", "DSt", "TSt", "QaSt", "QtSt", "SxSt", "SpSt", "OSt",
  "NSt", "Og", "UOg", "DOg", "TOg", "QaOg", "QtOg", "SxOg", "SpOg", "OOg", "NOg",
  "Nn", "UNn", "DNn", "TNn", "QaNn", "QtNn", "SxNn", "SpNn", "ONn", "NNn", "Ce"
];

const PREFIXES = [
  ["", "U", "D", "T", "Qa", "Qt", "Sx", "Sp", "O", "N"],
  ["", "Dc", "Vg", "Tg", "Qd", "Qi", "Se", "St", "Og", "Nn"],
  ["", "Ce", "Dn", "Tc", "Qe", "Qu", "Sc", "Si", "Oe", "Ne"]
];

const PREFIXES_2 = ["", "MI-", "MC-", "NA-", "PC-", "FM-"];

export class StandardNotation extends EngineeringNotation {
  public get name(): string {
    return "Standard";
  }

  public formatDecimal(value: Decimal, places: number, space: boolean = true): string {
    const engineering = toFixedEngineering(value, places);
    const mantissa = engineering.mantissa.toFixed(places);
    const abbreviation = engineering.exponent <= 303
      ? ABBREVIATIONS[engineering.exponent / 3]
      : this.abbreviate(engineering.exponent);
    return `${mantissa}${space ? " " : ""}${abbreviation}`;
  }

  private abbreviate(e: number): string {
    // Please, clean it up (I've got AIDS just from reading this code)
    e = Math.floor(e / 3) - 1;
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
      abbreviation += prefix[index2 * 3] + prefix[index2 * 3 + 1] + prefix[index2 * 3 + 2] + PREFIXES_2[index2--];
    }
    abbreviation = abbreviation.replace(/-$/, "");
    return abbreviation
      .replace("UM", "M")
      .replace("UNA", "NA")
      .replace("UPC", "PC")
      .replace("UFM", "FM");
  }
}
