const inputContainer = document.getElementById("inputContainer");

const NotationDisplay = function NotationDisplay(notationClass) {
  const notation = new notationClass();
  const span = document.createElement("span");
  inputContainer.after(span);
  return {
    update(value) {
      const formatted = value === "" ? "???" : notation.format(Decimal.fromString(value), 2, 0);
      span.textContent = notation.name + ": " + formatted;
    }
  };
};

const displays = (function() {
  const N = ADNotations;
  const notations = [
    N.ScientificNotation,
    N.EngineeringNotation,
    N.LettersNotation,
    N.StandardNotation,
    N.CancerNotation,
    N.MixedScientificNotation,
    N.MixedEngineeringNotation,
    N.LogarithmNotation,
    N.BracketsNotation,
    N.InfinityNotation,
    N.RomanNotation,
    N.DotsNotation,
    N.ZalgoNotation,
    N.HexNotation,
    N.ImperialNotation,
    N.ClockNotation,
    N.PrimeNotation,
    N.BarNotation,
    N.ShiNotation,
    N.BlindNotation
  ];
  return notations.reverse().map(n => new NotationDisplay(n));
}());

function updateValues() {
  const input = document.getElementById("number").value;
  ADNotations.Settings.exponentCommas.show = document.getElementById("commas").checked;
  for (const display of displays) {
    display.update(input);
  }
}

updateValues();
