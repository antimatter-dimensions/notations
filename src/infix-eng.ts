
import { AbstractInfixNotation } from "./infix-abstract";
// import Decimal from "break_infinity.js";

export class InfixEngineeringNotation extends AbstractInfixNotation {
	public get name(): string {
		return "Infix engineering";
	}

	protected formatMantissa(digit: number):string {
		return digit.toString(10);
	}
	protected formatExponent(exp: number):string {
		return this.numberToSubscript(exp);
	}
}
