import { CustomNotation } from "./custom";

const CANCER = [
  "😠", "🎂", "🎄", "💀", "🍆", "👪", "🌈", "💯", "🍦", "🎃", "💋", "😂", "🌙",
  "⛔", "🐙", "💩", "❓", "☢", "🙈", "👍", "☂", "✌", "⚠", "❌", "😋", "⚡"
];

export class CancerNotation extends CustomNotation {
  public constructor() {
    super(CANCER);
  }

  public get name(): string {
    return "Cancer";
  }
}
