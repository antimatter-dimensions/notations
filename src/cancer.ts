import { LettersNotation } from "./letters";

const CANCER = [
  "😠", "🎂", "🎄", "💀", "🍆", "👪", "🌈", "💯", "🍦", "🎃", "💋", "😂", "🌙",
  "⛔", "🐙", "💩", "❓", "☢", "🙈", "👍", "☂", "✌", "⚠", "❌", "😋", "⚡"
];

export class CancerNotation extends LettersNotation {
  public get name(): string {
    return "Cancer";
  }

  protected get letters(): string | string[] {
    return CANCER;
  }
}
