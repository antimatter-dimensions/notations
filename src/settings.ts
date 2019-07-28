import Decimal from "break_infinity.js/break_infinity";

export const Settings = {
  isInfinite: (decimal: Decimal) => decimal.gte(Decimal.MAX_VALUE),
  exponentCommas: {
    show: true,
    min: 100000,
    max: 1000000000
  }
};
