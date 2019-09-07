import Decimal from "break_infinity.js/break_infinity";
import { Notation } from "./notation";

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

    formatUnder1000(value: number): string
    {
        if(value < 1) return "β";
        let step = Math.floor(Math.log2(value));
        let omegaAmount = Math.floor(step / this.greek.length);
        if(omegaAmount === 0)
        {
            return this.greek[step % this.greek.length];
        }
        let omegas = [];
        for(let i = 0; i < omegaAmount; i++)
        {
            omegas.push("ω");
        }
        return omegas.join("^") + "^" + this.greek[step % this.greek.length];
    }

    formatDecimal(value: Decimal): string
    {
        let step = Decimal.floor(new Decimal(Decimal.log2(value)));
        if(value.gte(1e6))
        {
            step = Decimal.floor(step.add(value.div(1000000).pow(0.01)));
        }
        let omegaAmount = Decimal.floor(step.div(this.greek.length));
        let lastLetter = this.greek[step.toNumber() % this.greek.length];
        if(lastLetter === undefined || step.toNumber() > Number.MAX_SAFE_INTEGER) lastLetter = "ω";
        if(omegaAmount.equals(0))
        {
            return this.greek[step.toNumber() % this.greek.length];
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
        else
        {
            return "ω(" + this.formatDecimal(omegaAmount) + ")^" + lastLetter;
        }
    }
}