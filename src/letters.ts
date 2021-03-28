import { CustomNotation } from "./custom";

const LETTERS = "abcdefghijklmnopqrstuvwxyz";

export class LettersNotation extends CustomNotation {
  public constructor() {
    super(LETTERS);
  }

  public get name(): string {
    return "Letters";
  }
}
