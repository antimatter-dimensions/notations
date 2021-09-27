import { CustomNotation } from "./custom";

const EMOJI = [
  "😠", "🎂", "🎄", "💀", "🍆", "👪", "🌈", "💯", "🍦", "🎃", "💋", "😂", "🌙",
  "⛔", "🐙", "💩", "❓", "☢", "🙈", "👍", "☂", "✌", "⚠", "❌", "😋", "⚡"
];

export class EmojiNotation extends CustomNotation {
  public constructor() {
    super(EMOJI);
  }

  public get name(): string {
    return "Emoji";
  }
}
