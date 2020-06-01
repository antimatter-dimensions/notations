import { CustomBaseNotation } from "./custom-base";

export class HexadecimalNotation extends CustomBaseNotation {
  constructor() {
    super("0123456789ABCDEF");
  }
  
  public get name(): string {
    return "Hexadecimal";
  }
}