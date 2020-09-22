
// Copy-pasted from standard.ts

const ABBREVIATIONS = [
  ".", "K", "M", "B", "T", "Qa", "Qt", "Sx", "Sp", "Oc", "No", "Dc", "UDc", "DDc",
  "TDc", "QaDc", "QtDc", "SxDc", "SpDc", "ODc", "NDc", "Vg", "UVg", "DVg", "TVg",
  "QaVg", "QtVg", "SxVg", "SpVg", "OVg", "NVg", "Tg", "UTg", "DTg", "TTg", "QaTg",
  "QtTg", "SxTg", "SpTg", "OTg", "NTg", "Qd", "UQd", "DQd", "TQd", "QaQd", "QtQd",
  "SxQd", "SpQd", "OQd", "NQd", "Qi", "UQi", "DQi", "TQi", "QaQi", "QtQi", "SxQi",
  "SpQi", "OQi", "NQi", "Se", "USe", "DSe", "TSe", "QaSe", "QtSe", "SxSe", "SpSe",
  "OSe", "NSe", "St", "USt", "DSt", "TSt", "QaSt", "QtSt", "SxSt", "SpSt", "OSt",
  "NSt", "Og", "UOg", "DOg", "TOg", "QaOg", "QtOg", "SxOg", "SpOg", "OOg", "NOg",
  "Nn", "UNn", "DNn", "TNn", "QaNn", "QtNn", "SxNn", "SpNn", "ONn", "NNn", "Ce"
];


import { AbstractInfixNotation } from "./infix-abstract";

// Name comes from https://en.wikipedia.org/wiki/Long_and_short_scales
export class InfixShortScaleNotation extends AbstractInfixNotation {
	public get name(): string {
		return "Infix short scale";
	}

	protected formatMantissa(digit: number):string {
		return this.numberToSubscript(digit);
	}
	protected formatExponent(exp: number):string {
		const i = exp / 3;
// 		return exp.toString(10);
		return (i > -1 && i <= 101)
			? ABBREVIATIONS[i]
			: (i-1).toString(10);
	}
}
