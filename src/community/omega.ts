import { Notation } from "../notation";
import Decimal from "break_infinity.js/break_infinity";

export class OmegaNotation extends Notation
{
    public get name(): string
    {
        return "Omega";
    }

    get greek(): string
    {
        return "βζλψΣΘΨω";
    }

    get subNums(): string
    {
        return "₀₁₂₃₄₅₆₇₈₉";
    }

    get infinite(): string
    {
        return "Ω";
    }

    createSubNum(num: number)
    {
        let str = num.toFixed(0);
        let res = "";
        for(let i = 0; i < str.length; i++)
        {
            res += this.subNums[parseInt(str[i])];
        }
        return res;
    }

    formatUnder1000(value: number): string
    {
        return this.formatDecimal(new Decimal(value));
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
        else if(omegaAmount.gt(0) && omegaAmount.lte(3))
        {
            let omegas = [];
            for(let i = 0; i < omegaAmount.toNumber(); i++)
            {
                omegas.push("ω");
            }
            return omegas.join("^") + "^" + lastLetter;
        }
        else if(omegaAmount.gt(3) && omegaAmount.lt(10))
        {
            return "ω(" + omegaAmount.toFixed(0) + ")^" + lastLetter;
        }
        else if(omegaOrder < 3)
        {
            return "ω(" + this.formatDecimal(omegaAmount) + ")^" + lastLetter;
        }
        else if(omegaOrder < 6)
        {
            return "ω(" + this.formatDecimal(omegaAmount) + ")";
        }
        else
        {
            let val = Decimal.pow(8000, omegaOrder % 1);
            let orderStr = omegaOrder < 100 ? Math.floor(omegaOrder).toFixed(0) : this.formatDecimal(Decimal.floor(omegaOrder));
            return "ω[" + orderStr + "](" + this.formatDecimal(val) + ")";
        }
    }
}
