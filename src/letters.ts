import { CustomNotation } from "./custom";

const LETTERS = "abcdefghijklmnopqrstuvwxyz";

export class LettersNotation extends CustomNotation {
  constructor() {
    super(LETTERS);
  }
  
  public get name(): string {
    return "Letters";
  }
}
