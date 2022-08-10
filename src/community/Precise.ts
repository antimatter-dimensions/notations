import { formatWithCommas } from "./utils";

class PreciseNotation extends ADNotations.Notation {
  get name() {
    return "Precise";
  }

  formatDecimal(value: Decimal) {
    return formatWithCommas(value);
  }
}
