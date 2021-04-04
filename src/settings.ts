import Decimal from "break_infinity.js";

// eslint-disable-next-line @typescript-eslint/naming-convention
export const Settings = {
  isInfinite: (decimal: Decimal): boolean => decimal.gte(Decimal.MAX_VALUE),
  exponentCommas: {
    show: true,
    min: 100000,
    max: 1000000000
  }
};
