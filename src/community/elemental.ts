import Decimal from "break_infinity.js";
import { Notation } from "../notation";

const ELEMENT_LISTS = [
  ["H"],
  ["He", "Li", "Be", "B", "C", "N", "O", "F"],
  ["Ne", "Na", "Mg", "Al", "Si", "P", "S", "Cl"],
  [
    "Ar", "K", "Ca", "Sc", "Ti", "V", "Cr", "Mn", "Fe",
    "Co", "Ni", "Cu", "Zn", "Ga", "Ge", "As", "Se", "Br"
  ],
  [
    "Kr", "Rb", "Sr", "Y", "Zr", "Nb", "Mo", "Tc", "Ru",
    "Rh", "Pd", "Ag", "Cd", "In", "Sn", "Sb", "Te", "I"
  ],
  [
    "Xe", "Cs", "Ba", "La", "Ce", "Pr", "Nd", "Pm",
    "Sm", "Eu", "Gd", "Tb", "Dy", "Ho", "Er", "Tm",
    "Yb", "Lu", "Hf", "Ta", "W", "Re", "Os", "Ir",
    "Pt", "Au", "Hg", "Tl", "Pb", "Bi", "Po", "At"
  ],
  [
    "Rn", "Fr", "Ra", "Ac", "Th", "Pa", "U", "Np",
    "Pu", "Am", "Cm", "Bk", "Cf", "Es", "Fm", "Md",
    "No", "Lr", "Rf", "Db", "Sg", "Bh", "Hs", "Mt",
    "Ds", "Rg", "Cn", "Nh", "Fl", "Mc", "Lv", "Ts"
  ],
  ["Og"]
];

export class ElementalNotation extends Notation {
  public get name(): string {
    return "Elemental";
  }

  public get infinite(): string {
    return "Infinity";
  }

  public formatUnder1000(value: number, placesUnder1000: number): string {
    return this.elemental(new Decimal(value), placesUnder1000);
  }

  public formatDecimal(value: Decimal, places: number): string {
    return this.elemental(value, places);
  }

  private getAbbreviationAndValue(x: number): [string, number] {
    const abbreviationListIndexUnfloored = Math.log(x) / Math.log(118);
    const abbreviationListIndex = Math.floor(abbreviationListIndexUnfloored);
    const abbreviationList = ELEMENT_LISTS[Math.floor(abbreviationListIndex)];
    // eslint-disable-next-line function-paren-newline
    const abbreviationSublistIndex = Math.floor(
      (abbreviationListIndexUnfloored - abbreviationListIndex) * abbreviationList.length);
    const abbreviation = abbreviationList[abbreviationSublistIndex];
    const value = 118 ** (abbreviationListIndex + abbreviationSublistIndex / abbreviationList.length);
    return [abbreviation, value];
  }

  private formatElementalPart(abbreviation: string, n: number): string {
    if (n === 1) {
      return abbreviation;
    }
    return `${n} ${abbreviation}`;
  }

  private elemental(value: Decimal, places: number): string {
    let log = value.log(118);
    const parts: [string, number][] = [];
    while (log >= 1 && parts.length < 4) {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const [abbreviation, value] = this.getAbbreviationAndValue(log);
      const n = Math.floor(log / value);
      log -= n * value;
      parts.unshift([abbreviation, n]);
    }
    if (parts.length >= 4) {
      return parts.map((x) => this.formatElementalPart(x[0], x[1])).join(" + ");
    }
    const formattedMantissa = Decimal.pow(118, log).toFixed(places);
    if (parts.length === 0) {
      return formattedMantissa;
    }
    if (parts.length === 1) {
      return `${formattedMantissa} × ${this.formatElementalPart(parts[0][0], parts[0][1])}`;
    }
    return `${formattedMantissa} × (${parts.map((x) => this.formatElementalPart(x[0], x[1])).join(" + ")})`;
  }
}
