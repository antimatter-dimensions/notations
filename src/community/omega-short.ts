import { OmegaNotation } from "./omega";
import Decimal from "break_infinity.js/break_infinity";

export class OmegaShortNotation extends OmegaNotation
{
    public get name(): string
    {
        return "Omega (Short)";
    }

    formatDecimal(value: Decimal): string
    {
        value = new Decimal(value);
        let step = Decimal.floor(value.div(1000));
        let omegaAmount = Decimal.floor(step.div(this.greek.length));
        let lastLetter = this.greek[step.toNumber() % this.greek.length] + this.createSubNum(value.toNumber() % 1000);
        if(this.greek[step.toNumber() % this.greek.length] === undefined || step.toNumber() > Number.MAX_SAFE_INTEGER) lastLetter = "ω";
        let omegaOrder = Decimal.log(value, 8000);
        if(omegaAmount.equals(0))
        {
            return lastLetter;
        }
        else if(omegaAmount.gt(0) && omegaAmount.lte(2))
        {
            let omegas = [];
            for(let i = 0; i < omegaAmount.toNumber(); i++)
            {
                omegas.push("ω");
            }
            return omegas.join("^") + "^" + lastLetter;
        }
        else if(omegaAmount.gt(2) && omegaAmount.lt(10))
        {
            return "ω(" + omegaAmount.toFixed(0) + ")^" + lastLetter;
        }
        else
        {
            let val = Decimal.pow(8000, omegaOrder % 1);
            let orderStr = omegaOrder < 100 ? Math.floor(omegaOrder).toFixed(0) : this.formatDecimal(Decimal.floor(omegaOrder));
            return "ω[" + orderStr + "](" + this.formatDecimal(val) + ")";
        }
    }
}
