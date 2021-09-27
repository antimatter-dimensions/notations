const inputContainer = document.getElementById("inputContainer");

const parseWithoutE = function(value) {
  if (!value.match(/^[-+]?[,.0-9]*$/)) {
    return null;
  }
  if (value === "") {
    return new Decimal(1);
  }
  if (value === "-") {
    return new Decimal(-1);
  }
  if (!value.match(/\d/)) {
    return null;
  }
  return new Decimal(value.replace(/,/g, ""));
};


// This function only works if the base is more than 1
const pow = function(a, b) {
  if (b === Infinity) {
    return new Decimal(Infinity);
  } else if (b === -Infinity) {
    return new Decimal(0);
  } else {
    return Decimal.pow(a, b);
  }
}

const parse = function(value) {
  const stringParts = value.split("e");
  if (!stringParts[stringParts.length - 1].match(/\d/)) {
    return null;
  }
  const numberParts = stringParts.map(parseWithoutE);
  if (numberParts.includes(null)) {
    return null;
  }
  return numberParts.reduceRight((a, b) => pow(10, a.toNumber()).times(b));
};

const NotationDisplay = function NotationDisplay(notationClass) {
  const notation = new notationClass();
  const span = document.createElement("span");
  inputContainer.after(span);
  return {
    update(value, placesValue) {
      const decimalValue = parse(value);
      const places = +placesValue;
      const formatted = decimalValue === null ? "???" : notation.format(decimalValue, places, places);
      span.textContent = `${notation.name}: ${formatted}`;
    }
  };
};

const communityHeaderSpan = function () {
  let span = document.createElement("span");
  span.textContent = "Community notations:";
  return span;
}

const displays = (function() {
  const N = ADNotations;
  const CN = ADCommunityNotations;
  const notations = [
    N.ScientificNotation,
    N.EngineeringNotation,
    N.LettersNotation,
    N.StandardNotation,
    N.EmojiNotation,
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
    N.BlindNotation,
    N.AllNotation,
  ];
  const communityNotations = [
    CN.GreekLettersNotation,
    CN.OmegaNotation,
    CN.OmegaShortNotation,
    CN.PrecisePrimeNotation,
    CN.JapaneseNotation,
    CN.MixedLogarithmSciNotation,
    CN.TritetratedNotation,
    CN.FlagsNotation,
    CN.YesNoNotation,
    CN.EvilNotation,
    CN.EmojierNotation,
    CN.ChineseNotation,
    CN.ElementalNotation,
    CN.BinaryNotation,
    CN.HexadecimalNotation,
    CN.HahaFunnyNotation,
    CN.NiceNotation,
    CN.LongScaleNotation,
    CN.InfixEngineeringNotation,
    CN.InfixEngineeringReverseNotation,
    CN.InfixShortScaleNotation,
    CN.InfixLongScaleNotation,
    CN.EnglishNotation,
    CN.FoursNotation,
    CN.BlobsNotation
  ]
  let communityNotationsDisplay = communityNotations.reverse().map((n) => new NotationDisplay(n));
  inputContainer.after(communityHeaderSpan());
  let mainNotationsDisplay = notations.reverse().map((n) => new NotationDisplay(n));
  return mainNotationsDisplay.concat(communityNotationsDisplay);
}());

function updateValues() {
  const value = document.getElementById("number").value;
  const placesValue = document.getElementById("places").value;
  ADNotations.Settings.exponentCommas.show = document.getElementById("commas").checked;
  for (const display of displays) {
    display.update(value, placesValue);
  }
}

updateValues();
