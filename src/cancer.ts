import { LettersNotation } from "./letters";

const CANCER = [
  "😠", "🎂", "🎄", "💀", "🍆", "👪", "🌈", "💯", "🍦", "🎃", "💋", "😂", "🌙",
  "⛔", "🐙", "💩", "❓", "☢", "🙈", "👍", "☂", "✌", "⚠", "❌", "😋", "⚡"
];

export class CancerNotation extends LettersNotation {
  protected get letters(): string | string[] {
    return CANCER;
  }
}
