import { CustomBaseNotation } from "./custom-base";

export class HexadecimalNotation extends CustomBaseNotation {
  public constructor() {
    super("0123456789ABCDEF", 16);
  }

  public get name(): string {
    return "Hexadecimal";
  }
}

