import { CustomBaseNotation } from "./custom-base";

export class BinaryNotation extends CustomBaseNotation {
  public constructor() {
    super("01", 2);
  }

  public get name(): string {
    return "Binary";
  }
}

