import Decimal from 'break_infinity.js/break_infinity';
import { __extends } from 'tslib';

var Settings = {
  isInfinite: function isInfinite(decimal) {
    return decimal.gte(Decimal.MAX_VALUE);
  },
  exponentCommas: {
    show: true,
    min: 100000,
    max: 1000000000
  }
};

var commaRegexp = /\B(?=([0-9]{3})+(?![0-9]))/g;
function formatWithCommas(value) {
  var decimalPointSplit = value.toString().split(".");
  decimalPointSplit[0] = decimalPointSplit[0].replace(commaRegexp, ",");
  return decimalPointSplit.join(".");
}
function fixMantissaOverflow(value, places, threshold, powerOffset) {
  var pow10 = Math.pow(10, places);
  var isOverflowing = Math.round(value.mantissa * pow10) >= threshold * pow10;

  if (isOverflowing) {
    return Decimal.fromMantissaExponent_noNormalize(1, value.exponent + powerOffset);
  }

  return value;
}
function toEngineering(value) {
  var exponentOffset = value.exponent % 3;
  return Decimal.fromMantissaExponent_noNormalize(value.mantissa * Math.pow(10, exponentOffset), value.exponent - exponentOffset);
}
function toFixedEngineering(value, places) {
  return fixMantissaOverflow(toEngineering(value), places, 1000, 3);
}
var SUBSCRIPT_NUMBERS = ["₀", "₁", "₂", "₃", "₄", "₅", "₆", "₇", "₈", "₉"];
function toSubscript(value) {
  return value.toFixed(0).split("").map(function (x) {
    return SUBSCRIPT_NUMBERS[parseInt(x)];
  }).join("");
}
var SUPERSCRIPT_NUMBERS = ["⁰", "¹", "²", "³", "⁴", "⁵", "⁶", "⁷", "⁸", "⁹"];
function toSuperscript(value) {
  return value.toFixed(0).split("").map(function (x) {
    return SUPERSCRIPT_NUMBERS[parseInt(x)];
  }).join("");
}

var Notation = function () {
  function Notation() {}

  Notation.prototype.format = function (value, places, placesUnder1000) {
    if (places === void 0) {
      places = 0;
    }

    if (placesUnder1000 === void 0) {
      placesUnder1000 = 0;
    }

    if (typeof value === "number" && !Number.isFinite(value)) {
      return this.infinite;
    }

    var decimal = Decimal.fromValue_noAlloc(value);

    if (decimal.exponent < -300) {
      return decimal.sign() < 0 ? this.formatVerySmallNegativeDecimal(decimal.abs(), placesUnder1000) : this.formatVerySmallDecimal(decimal, placesUnder1000);
    }

    if (decimal.exponent < 3) {
      var number = decimal.toNumber();
      return number < 0 ? this.formatNegativeUnder1000(Math.abs(number), placesUnder1000) : this.formatUnder1000(number, placesUnder1000);
    }

    if (Settings.isInfinite(decimal.abs())) {
      return decimal.sign() < 0 ? this.negativeInfinite : this.infinite;
    }

    return decimal.sign() < 0 ? this.formatNegativeDecimal(decimal.abs(), places) : this.formatDecimal(decimal, places);
  };

  Object.defineProperty(Notation.prototype, "negativeInfinite", {
    get: function get() {
      return "-" + this.infinite;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(Notation.prototype, "infinite", {
    get: function get() {
      return "Infinite";
    },
    enumerable: true,
    configurable: true
  });

  Notation.prototype.formatVerySmallNegativeDecimal = function (value, places) {
    return "-" + this.formatVerySmallDecimal(value, places);
  };

  Notation.prototype.formatVerySmallDecimal = function (value, places) {
    return this.formatUnder1000(value.toNumber(), places);
  };

  Notation.prototype.formatNegativeUnder1000 = function (value, places) {
    return "-" + this.formatUnder1000(value, places);
  };

  Notation.prototype.formatUnder1000 = function (value, places) {
    return value.toFixed(places);
  };

  Notation.prototype.formatNegativeDecimal = function (value, places) {
    return "-" + this.formatDecimal(value, places);
  };

  Notation.prototype.formatExponent = function (exponent) {
    if (exponent < Settings.exponentCommas.min) {
      return exponent.toString();
    }

    if (this.showCommas(exponent)) {
      return formatWithCommas(exponent);
    }

    return this.formatDecimal(new Decimal(exponent), 3);
  };

  Notation.prototype.showCommas = function (exponent) {
    return Settings.exponentCommas.show && exponent < Settings.exponentCommas.max;
  };

  return Notation;
}();

var GreekLettersNotation = function (_super) {
  __extends(GreekLettersNotation, _super);

  function GreekLettersNotation() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  Object.defineProperty(GreekLettersNotation.prototype, "name", {
    get: function get() {
      return "Greek Letters";
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(GreekLettersNotation.prototype, "greek", {
    get: function get() {
      return "άαβγδεζηθικλμνξοπρστυφχψωΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ".split("");
    },
    enumerable: true,
    configurable: true
  });

  GreekLettersNotation.prototype.formatDecimal = function (value, places) {
    var exp = Math.floor(value.e / 3);
    var step = Math.pow(this.greek.length, Math.floor(Math.log(exp) / Math.log(this.greek.length)));
    var suffix = "";

    while (step >= 1) {
      var ordinal = Math.floor(exp / step);
      suffix += this.greek[ordinal];
      exp -= step * ordinal;
      step /= this.greek.length;
    }

    var mantissa = Decimal.pow(10, Decimal.log10(value) % 3).toFixed(places);
    return mantissa + " " + suffix;
  };

  return GreekLettersNotation;
}(Notation);

var OmegaNotation = function (_super) {
  __extends(OmegaNotation, _super);

  function OmegaNotation() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  Object.defineProperty(OmegaNotation.prototype, "name", {
    get: function get() {
      return "Omega";
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(OmegaNotation.prototype, "greek", {
    get: function get() {
      return "βζλψΣΘΨω";
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(OmegaNotation.prototype, "infinite", {
    get: function get() {
      return "Ω";
    },
    enumerable: true,
    configurable: true
  });

  OmegaNotation.prototype.formatUnder1000 = function (value) {
    return this.formatDecimal(new Decimal(value));
  };

  OmegaNotation.prototype.formatDecimal = function (value) {
    var step = Decimal.floor(value.div(1000));
    var omegaAmount = Decimal.floor(step.div(this.greek.length));
    var lastLetter = this.greek[step.toNumber() % this.greek.length] + toSubscript(value.toNumber() % 1000);
    var beyondGreekArrayBounds = this.greek[step.toNumber() % this.greek.length] === undefined;

    if (beyondGreekArrayBounds || step.toNumber() > Number.MAX_SAFE_INTEGER) {
      lastLetter = "ω";
    }

    var omegaOrder = Decimal.log(value, 8000);

    if (omegaAmount.equals(0)) {
      return lastLetter;
    } else if (omegaAmount.gt(0) && omegaAmount.lte(3)) {
      var omegas = [];

      for (var i = 0; i < omegaAmount.toNumber(); i++) {
        omegas.push("ω");
      }

      return omegas.join("^") + "^" + lastLetter;
    } else if (omegaAmount.gt(3) && omegaAmount.lt(10)) {
      return "ω(" + omegaAmount.toFixed(0) + ")^" + lastLetter;
    } else if (omegaOrder < 3) {
      return "ω(" + this.formatDecimal(omegaAmount) + ")^" + lastLetter;
    } else if (omegaOrder < 6) {
      return "ω(" + this.formatDecimal(omegaAmount) + ")";
    } else {
      var val = Decimal.pow(8000, omegaOrder % 1);
      var orderStr = omegaOrder < 100 ? Math.floor(omegaOrder).toFixed(0) : this.formatDecimal(Decimal.floor(omegaOrder));
      return "ω[" + orderStr + "](" + this.formatDecimal(val) + ")";
    }
  };

  return OmegaNotation;
}(Notation);

var OmegaShortNotation = function (_super) {
  __extends(OmegaShortNotation, _super);

  function OmegaShortNotation() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  Object.defineProperty(OmegaShortNotation.prototype, "name", {
    get: function get() {
      return "Omega (Short)";
    },
    enumerable: true,
    configurable: true
  });

  OmegaShortNotation.prototype.formatDecimal = function (value) {
    var step = Decimal.floor(value.div(1000));
    var omegaAmount = Decimal.floor(step.div(this.greek.length));
    var lastLetter = this.greek[step.toNumber() % this.greek.length] + toSubscript(value.toNumber() % 1000);
    var beyondGreekArrayBounds = this.greek[step.toNumber() % this.greek.length] === undefined;

    if (beyondGreekArrayBounds || step.toNumber() > Number.MAX_SAFE_INTEGER) {
      lastLetter = "ω";
    }

    var omegaOrder = Decimal.log(value, 8000);

    if (omegaAmount.equals(0)) {
      return lastLetter;
    } else if (omegaAmount.gt(0) && omegaAmount.lte(2)) {
      var omegas = [];

      for (var i = 0; i < omegaAmount.toNumber(); i++) {
        omegas.push("ω");
      }

      return omegas.join("^") + "^" + lastLetter;
    } else if (omegaAmount.gt(2) && omegaAmount.lt(10)) {
      return "ω(" + omegaAmount.toFixed(0) + ")^" + lastLetter;
    } else {
      var val = Decimal.pow(8000, omegaOrder % 1);
      var orderStr = omegaOrder < 100 ? Math.floor(omegaOrder).toFixed(0) : this.formatDecimal(Decimal.floor(omegaOrder));
      return "ω[" + orderStr + "](" + this.formatDecimal(val) + ")";
    }
  };

  return OmegaShortNotation;
}(OmegaNotation);

var MAX_INT = Number.MAX_SAFE_INTEGER;
var MAX_INT_DECIMAL = new Decimal(MAX_INT);
var MAX_INT_LOG_10 = Math.log10(MAX_INT);
var MAX_FACTOR = 10000;

var PrecisePrimeNotation = function (_super) {
  __extends(PrecisePrimeNotation, _super);

  function PrecisePrimeNotation() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  Object.defineProperty(PrecisePrimeNotation.prototype, "name", {
    get: function get() {
      return "Precise Prime";
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(PrecisePrimeNotation.prototype, "infinite", {
    get: function get() {
      return "Primefinity?";
    },
    enumerable: true,
    configurable: true
  });

  PrecisePrimeNotation.prototype.formatUnder1000 = function (value) {
    return this.primify(new Decimal(value));
  };

  PrecisePrimeNotation.prototype.formatDecimal = function (value) {
    return this.primify(value);
  };

  PrecisePrimeNotation.prototype.primify = function (value) {
    if (value.lte(MAX_INT_DECIMAL)) {
      var floored = Math.floor(value.toNumber());

      if (floored === 0) {
        return "0";
      }

      if (floored === 1) {
        return "1";
      }

      return this.formatFromList(this.primesFromInt(floored));
    }

    var exp = value.log10() / MAX_INT_LOG_10;
    var base = Math.pow(MAX_INT, exp / Math.ceil(exp));

    if (exp <= MAX_INT) {
      return this.formatPowerTower([Math.round(base), Math.ceil(exp)]);
    }

    var exp2 = Math.log10(exp) / Math.log10(MAX_INT);
    var exp2Ceil = Math.ceil(exp2);
    exp = Math.pow(MAX_INT, exp2 / exp2Ceil);
    base = Math.pow(MAX_INT, exp / Math.ceil(exp));
    return this.formatPowerTower([Math.round(base), Math.ceil(exp), exp2Ceil]);
  };

  PrecisePrimeNotation.prototype.maybeParenthesize = function (x, b) {
    return b ? "(" + x + ")" : x;
  };

  PrecisePrimeNotation.prototype.formatPowerTower = function (exps) {
    var _this = this;

    var factorizations = exps.map(function (x) {
      return _this.primesFromInt(x);
    });
    var superscriptLastExponent = factorizations[exps.length - 1].length === 1;
    var parenthesize = factorizations.map(function (x, i) {
      return x[0] !== x[x.length - 1] || i === exps.length - 2 && x.length > 1 && superscriptLastExponent;
    });
    var formattedExps = factorizations.map(function (x, i) {
      return _this.maybeParenthesize(i === exps.length - 1 && superscriptLastExponent ? toSuperscript(x[0]) : _this.formatFromList(x), parenthesize[i]);
    });

    if (superscriptLastExponent) {
      var superscript = formattedExps.pop();
      formattedExps[exps.length - 2] += superscript;
    }

    return formattedExps.join('^');
  };

  PrecisePrimeNotation.prototype.formatFromList = function (factors) {
    var out = [];
    var last = 0;
    var count = 0;

    for (var _i = 0, factors_1 = factors; _i < factors_1.length; _i++) {
      var i = factors_1[_i];

      if (i === last) {
        count++;
      } else {
        if (last > 0) {
          if (count > 1) {
            out.push("" + last + toSuperscript(count));
          } else {
            out.push(last);
          }
        }

        last = i;
        count = 1;
      }
    }

    if (count > 1) {
      out.push("" + last + toSuperscript(count));
    } else {
      out.push(last);
    }

    return out.join("\xD7");
  };

  PrecisePrimeNotation.prototype.primesFromInt = function (num) {
    var n = num;
    var l = [];

    for (var _i = 0, _a = [2, 3]; _i < _a.length; _i++) {
      var k = _a[_i];

      for (; n % k == 0; n /= k) {
        l.push(k);
      }
    }

    var lim = Math.min(MAX_FACTOR, Math.floor(Math.sqrt(n)));

    for (var a = 5; a <= lim && a < n;) {
      for (; n % a == 0; n /= a) {
        l.push(a);
      }

      a += 2;

      for (; n % a == 0; n /= a) {
        l.push(a);
      }

      a += 4;
    }

    if (n > 1) {
      l.push(n);
    }

    return l;
  };

  return PrecisePrimeNotation;
}(Notation);

var JPNNOT_SUFFIXES = ['', '万', '億', '兆', '京', '垓', '秭', '穣', '溝', '澗', '正', '載', '極', '恒河沙', '阿僧祇', '那由他', '不可思議', '無量大数'];

var JapaneseNotation = function (_super) {
  __extends(JapaneseNotation, _super);

  function JapaneseNotation() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  Object.defineProperty(JapaneseNotation.prototype, "name", {
    get: function get() {
      return "Japanese";
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(JapaneseNotation.prototype, "infinite", {
    get: function get() {
      return "無限";
    },
    enumerable: true,
    configurable: true
  });

  JapaneseNotation.prototype.formatDecimal = function (value, places) {
    if (value.exponent < 72) {
      return this.jpnNotation(value);
    } else {
      return value.mantissa.toFixed(places) + '×10の' + this.jpnNotation(new Decimal(value.exponent)) + '乗';
    }
  };

  JapaneseNotation.prototype.getSuffix = function (x) {
    return JPNNOT_SUFFIXES[x];
  };

  JapaneseNotation.prototype.jpnNotation = function (value) {
    var exponentLast = Math.max(0, Math.floor(value.exponent / 4));
    var mantissa = Decimal.times(Decimal.pow(10, value.exponent - 4 * exponentLast), value.mantissa).toFixed(4);
    var integerPart = Decimal.floor(mantissa);
    var subExponent = Decimal.times(Decimal.minus(mantissa, integerPart), 10000);
    var money_str = "" + integerPart + this.getSuffix(exponentLast);

    if (exponentLast >= 1 && subExponent.neq(0)) {
      money_str += subExponent + this.getSuffix(exponentLast - 1);
    }

    return money_str;
  };

  return JapaneseNotation;
}(Notation);

var ScientificNotation = function (_super) {
  __extends(ScientificNotation, _super);

  function ScientificNotation() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  Object.defineProperty(ScientificNotation.prototype, "name", {
    get: function get() {
      return "Scientific";
    },
    enumerable: true,
    configurable: true
  });

  ScientificNotation.prototype.formatDecimal = function (value, places) {
    var fixedValue = fixMantissaOverflow(value, places, 10, 1);
    var mantissa = fixedValue.mantissa.toFixed(places);
    var exponent = this.formatExponent(fixedValue.exponent);
    return mantissa + "e" + exponent;
  };

  return ScientificNotation;
}(Notation);

var scientific = new ScientificNotation();

var MixedLogarithmSciNotation = function (_super) {
  __extends(MixedLogarithmSciNotation, _super);

  function MixedLogarithmSciNotation() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  Object.defineProperty(MixedLogarithmSciNotation.prototype, "name", {
    get: function get() {
      return "Mixed Logarithm (Sci)";
    },
    enumerable: true,
    configurable: true
  });

  MixedLogarithmSciNotation.prototype.formatDecimal = function (value, places) {
    if (value.exponent < 33) return scientific.formatDecimal(value, places);
    return "e" + this.formatLog(value.log10(), places);
  };

  MixedLogarithmSciNotation.prototype.formatLog = function (exponent, places) {
    if (exponent < Settings.exponentCommas.min) {
      return exponent.toFixed(places);
    }

    if (this.showCommas(exponent)) {
      return formatWithCommas(exponent.toFixed(places));
    }

    return scientific.formatDecimal(new Decimal(exponent), 3);
  };

  return MixedLogarithmSciNotation;
}(Notation);

var TritetratedNotation = function (_super) {
  __extends(TritetratedNotation, _super);

  function TritetratedNotation() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  Object.defineProperty(TritetratedNotation.prototype, "name", {
    get: function get() {
      return "Tritetrated";
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(TritetratedNotation.prototype, "infinite", {
    get: function get() {
      return 'Infinity';
    },
    enumerable: true,
    configurable: true
  });

  TritetratedNotation.prototype.formatUnder1000 = function (value) {
    return this.tritetrated(new Decimal(value));
  };

  TritetratedNotation.prototype.formatDecimal = function (value) {
    return this.tritetrated(value);
  };

  TritetratedNotation.prototype.tritetrated = function (value) {
    var low = 0;
    var high = 16;

    while (high - low > 1e-7) {
      var mid = (low + high) / 2;

      if (Decimal.pow(mid, Math.pow(mid, mid)).lt(value)) {
        low = mid;
      } else {
        high = mid;
      }
    }

    return low.toFixed(4) + '↑↑3';
  };

  return TritetratedNotation;
}(Notation);

var EngineeringNotation = function (_super) {
  __extends(EngineeringNotation, _super);

  function EngineeringNotation() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  Object.defineProperty(EngineeringNotation.prototype, "name", {
    get: function get() {
      return "Engineering";
    },
    enumerable: true,
    configurable: true
  });

  EngineeringNotation.prototype.formatDecimal = function (value, places) {
    var engineering = toFixedEngineering(value, places);
    var mantissa = engineering.mantissa.toFixed(places);
    var exponent = this.formatExponent(engineering.exponent);
    return mantissa + "e" + exponent;
  };

  return EngineeringNotation;
}(Notation);

var CustomNotation = function (_super) {
  __extends(CustomNotation, _super);

  function CustomNotation(letters, mantissaExponentSeparator, separator) {
    if (mantissaExponentSeparator === void 0) {
      mantissaExponentSeparator = "";
    }

    if (separator === void 0) {
      separator = "";
    }

    var _this = this;

    if (letters.length < 2) {
      throw new Error("The supplied letter sequence must contain at least 2 letters");
    }

    _this = _super.call(this) || this;
    _this.letters = letters;
    _this.mantissaExponentSeparator = mantissaExponentSeparator;
    _this.separator = separator;
    return _this;
  }

  Object.defineProperty(CustomNotation.prototype, "name", {
    get: function get() {
      return "Custom";
    },
    enumerable: true,
    configurable: true
  });

  CustomNotation.prototype.formatDecimal = function (value, places) {
    var engineering = toEngineering(value);
    var mantissa = engineering.mantissa.toFixed(places);
    return mantissa + this.mantissaExponentSeparator + this.transcribe(engineering.exponent).join(this.separator);
  };

  CustomNotation.prototype.transcribe = function (exponent) {
    var normalizedExponent = exponent / 3;
    var base = this.letters.length;

    if (normalizedExponent <= base) {
      return [this.letters[normalizedExponent - 1]];
    }

    var letters = [];

    while (normalizedExponent > base) {
      var remainder = normalizedExponent % base;
      var letterIndex = (remainder === 0 ? base : remainder) - 1;
      letters.push(this.letters[letterIndex]);
      normalizedExponent = (normalizedExponent - remainder) / base;

      if (remainder === 0) {
        normalizedExponent--;
      }
    }

    letters.push(this.letters[normalizedExponent - 1]);
    return letters.reverse();
  };

  return CustomNotation;
}(EngineeringNotation);

var FLAGS = ["\uD83C\uDDE6\uD83C\uDDEB", "\uD83C\uDDE6\uD83C\uDDE9", "\uD83C\uDDE6\uD83C\uDDEA", "\uD83C\uDDE6\uD83C\uDDEB", "\uD83C\uDDE6\uD83C\uDDEC", "\uD83C\uDDE6\uD83C\uDDEE", "\uD83C\uDDE6\uD83C\uDDF1", "\uD83C\uDDE6\uD83C\uDDF2", "\uD83C\uDDE6\uD83C\uDDF4", "\uD83C\uDDE6\uD83C\uDDF6", "\uD83C\uDDE6\uD83C\uDDF7", "\uD83C\uDDE6\uD83C\uDDF8", "\uD83C\uDDE6\uD83C\uDDF9", "\uD83C\uDDE6\uD83C\uDDFA", "\uD83C\uDDE6\uD83C\uDDFC", "\uD83C\uDDE6\uD83C\uDDFD", "\uD83C\uDDE6\uD83C\uDDFF", "\uD83C\uDDE7\uD83C\uDDE6", "\uD83C\uDDE7\uD83C\uDDE7", "\uD83C\uDDE7\uD83C\uDDE9", "\uD83C\uDDE7\uD83C\uDDEA", "\uD83C\uDDE7\uD83C\uDDEB", "\uD83C\uDDE7\uD83C\uDDEC", "\uD83C\uDDE7\uD83C\uDDED", "\uD83C\uDDE7\uD83C\uDDEE", "\uD83C\uDDE7\uD83C\uDDEF", "\uD83C\uDDE7\uD83C\uDDF1", "\uD83C\uDDE7\uD83C\uDDF2", "\uD83C\uDDE7\uD83C\uDDF3", "\uD83C\uDDE7\uD83C\uDDF4", "\uD83C\uDDE7\uD83C\uDDF6", "\uD83C\uDDE7\uD83C\uDDF7", "\uD83C\uDDE7\uD83C\uDDF8", "\uD83C\uDDE7\uD83C\uDDF9", "\uD83C\uDDE7\uD83C\uDDFB", "\uD83C\uDDE7\uD83C\uDDFC", "\uD83C\uDDE7\uD83C\uDDFE", "\uD83C\uDDE7\uD83C\uDDFF", "\uD83C\uDDE8\uD83C\uDDE6", "\uD83C\uDDE8\uD83C\uDDE8", "\uD83C\uDDE8\uD83C\uDDE9", "\uD83C\uDDE8\uD83C\uDDEB", "\uD83C\uDDE8\uD83C\uDDEC", "\uD83C\uDDE8\uD83C\uDDED", "\uD83C\uDDE8\uD83C\uDDEE", "\uD83C\uDDE8\uD83C\uDDF0", "\uD83C\uDDE8\uD83C\uDDF1", "\uD83C\uDDE8\uD83C\uDDF2", "\uD83C\uDDE8\uD83C\uDDF3", "\uD83C\uDDE8\uD83C\uDDF4", "\uD83C\uDDE8\uD83C\uDDF5", "\uD83C\uDDE8\uD83C\uDDF7", "\uD83C\uDDE8\uD83C\uDDFA", "\uD83C\uDDE8\uD83C\uDDFB", "\uD83C\uDDE8\uD83C\uDDFC", "\uD83C\uDDE8\uD83C\uDDFD", "\uD83C\uDDE8\uD83C\uDDFE", "\uD83C\uDDE8\uD83C\uDDFF", "\uD83C\uDDE9\uD83C\uDDEA", "\uD83C\uDDE9\uD83C\uDDEC", "\uD83C\uDDE9\uD83C\uDDEF", "\uD83C\uDDE9\uD83C\uDDF0", "\uD83C\uDDE9\uD83C\uDDF2", "\uD83C\uDDE9\uD83C\uDDF4", "\uD83C\uDDE9\uD83C\uDDFF", "\uD83C\uDDEA\uD83C\uDDE6", "\uD83C\uDDEA\uD83C\uDDE8", "\uD83C\uDDEA\uD83C\uDDEA", "\uD83C\uDDEA\uD83C\uDDEC", "\uD83C\uDDEA\uD83C\uDDED", "\uD83C\uDDEA\uD83C\uDDF7", "\uD83C\uDDEA\uD83C\uDDF8", "\uD83C\uDDEA\uD83C\uDDF9", "\uD83C\uDDEA\uD83C\uDDFA", "\uD83C\uDDEB\uD83C\uDDEE", "\uD83C\uDDEB\uD83C\uDDEF", "\uD83C\uDDEB\uD83C\uDDF0", "\uD83C\uDDEB\uD83C\uDDF2", "\uD83C\uDDEB\uD83C\uDDF4", "\uD83C\uDDEB\uD83C\uDDF7", "\uD83C\uDDEC\uD83C\uDDE6", "\uD83C\uDDEC\uD83C\uDDE7", "\uD83C\uDDEC\uD83C\uDDE9", "\uD83C\uDDEC\uD83C\uDDEA", "\uD83C\uDDEC\uD83C\uDDEB", "\uD83C\uDDEC\uD83C\uDDEC", "\uD83C\uDDEC\uD83C\uDDED", "\uD83C\uDDEC\uD83C\uDDEE", "\uD83C\uDDEC\uD83C\uDDF1", "\uD83C\uDDEC\uD83C\uDDF2", "\uD83C\uDDEC\uD83C\uDDF3", "\uD83C\uDDEC\uD83C\uDDF5", "\uD83C\uDDEC\uD83C\uDDF6", "\uD83C\uDDEC\uD83C\uDDF7", "\uD83C\uDDEC\uD83C\uDDF8", "\uD83C\uDDEC\uD83C\uDDF9", "\uD83C\uDDEC\uD83C\uDDFA", "\uD83C\uDDEC\uD83C\uDDFC", "\uD83C\uDDEC\uD83C\uDDFE", "\uD83C\uDDED\uD83C\uDDF0", "\uD83C\uDDED\uD83C\uDDF2", "\uD83C\uDDED\uD83C\uDDF3", "\uD83C\uDDED\uD83C\uDDF7", "\uD83C\uDDED\uD83C\uDDF9", "\uD83C\uDDED\uD83C\uDDFA", "\uD83C\uDDEE\uD83C\uDDE8", "\uD83C\uDDEE\uD83C\uDDE9", "\uD83C\uDDEE\uD83C\uDDEA", "\uD83C\uDDEE\uD83C\uDDF1", "\uD83C\uDDEE\uD83C\uDDF2", "\uD83C\uDDEE\uD83C\uDDF3", "\uD83C\uDDEE\uD83C\uDDF4", "\uD83C\uDDEE\uD83C\uDDF6", "\uD83C\uDDEE\uD83C\uDDF7", "\uD83C\uDDEE\uD83C\uDDF8", "\uD83C\uDDEE\uD83C\uDDF9", "\uD83C\uDDEF\uD83C\uDDEA", "\uD83C\uDDEF\uD83C\uDDF2", "\uD83C\uDDEF\uD83C\uDDF4", "\uD83C\uDDEF\uD83C\uDDF5", "\uD83C\uDDF0\uD83C\uDDEA", "\uD83C\uDDF0\uD83C\uDDEC", "\uD83C\uDDF0\uD83C\uDDED", "\uD83C\uDDF0\uD83C\uDDEE", "\uD83C\uDDF0\uD83C\uDDF2", "\uD83C\uDDF0\uD83C\uDDF3", "\uD83C\uDDF0\uD83C\uDDF5", "\uD83C\uDDF0\uD83C\uDDF7", "\uD83C\uDDF0\uD83C\uDDFC", "\uD83C\uDDF0\uD83C\uDDFE", "\uD83C\uDDF0\uD83C\uDDFF", "\uD83C\uDDF1\uD83C\uDDE6", "\uD83C\uDDF1\uD83C\uDDE7", "\uD83C\uDDF1\uD83C\uDDE8", "\uD83C\uDDF1\uD83C\uDDEE", "\uD83C\uDDF1\uD83C\uDDF0", "\uD83C\uDDF1\uD83C\uDDF7", "\uD83C\uDDF1\uD83C\uDDF8", "\uD83C\uDDF1\uD83C\uDDF9", "\uD83C\uDDF1\uD83C\uDDFA", "\uD83C\uDDF1\uD83C\uDDFB", "\uD83C\uDDF1\uD83C\uDDFE", "\uD83C\uDDF2\uD83C\uDDE6", "\uD83C\uDDF2\uD83C\uDDE8", "\uD83C\uDDF2\uD83C\uDDE9", "\uD83C\uDDF2\uD83C\uDDEA", "\uD83C\uDDF2\uD83C\uDDEB", "\uD83C\uDDF2\uD83C\uDDEC", "\uD83C\uDDF2\uD83C\uDDED", "\uD83C\uDDF2\uD83C\uDDF0", "\uD83C\uDDF2\uD83C\uDDF1", "\uD83C\uDDF2\uD83C\uDDF2", "\uD83C\uDDF2\uD83C\uDDF3", "\uD83C\uDDF2\uD83C\uDDF4", "\uD83C\uDDF2\uD83C\uDDF5", "\uD83C\uDDF2\uD83C\uDDF6", "\uD83C\uDDF2\uD83C\uDDF7", "\uD83C\uDDF2\uD83C\uDDF8", "\uD83C\uDDF2\uD83C\uDDF9", "\uD83C\uDDF2\uD83C\uDDFA", "\uD83C\uDDF2\uD83C\uDDFB", "\uD83C\uDDF2\uD83C\uDDFC", "\uD83C\uDDF2\uD83C\uDDFD", "\uD83C\uDDF2\uD83C\uDDFE", "\uD83C\uDDF2\uD83C\uDDFF", "\uD83C\uDDF3\uD83C\uDDE6", "\uD83C\uDDF3\uD83C\uDDE8", "\uD83C\uDDF3\uD83C\uDDEA", "\uD83C\uDDF3\uD83C\uDDEB", "\uD83C\uDDF3\uD83C\uDDEC", "\uD83C\uDDF3\uD83C\uDDEE", "\uD83C\uDDF3\uD83C\uDDF1", "\uD83C\uDDF3\uD83C\uDDF4", "\uD83C\uDDF3\uD83C\uDDF5", "\uD83C\uDDF3\uD83C\uDDF7", "\uD83C\uDDF3\uD83C\uDDFA", "\uD83C\uDDF3\uD83C\uDDFF", "\uD83C\uDDF4\uD83C\uDDF2", "\uD83C\uDDF5\uD83C\uDDE6", "\uD83C\uDDF5\uD83C\uDDEA", "\uD83C\uDDF5\uD83C\uDDEB", "\uD83C\uDDF5\uD83C\uDDEC", "\uD83C\uDDF5\uD83C\uDDED", "\uD83C\uDDF5\uD83C\uDDF0", "\uD83C\uDDF5\uD83C\uDDF1", "\uD83C\uDDF5\uD83C\uDDF2", "\uD83C\uDDF5\uD83C\uDDF3", "\uD83C\uDDF5\uD83C\uDDF7", "\uD83C\uDDF5\uD83C\uDDF8", "\uD83C\uDDF5\uD83C\uDDF9", "\uD83C\uDDF5\uD83C\uDDFC", "\uD83C\uDDF5\uD83C\uDDFE", "\uD83C\uDDF6\uD83C\uDDE6", "\uD83C\uDDF7\uD83C\uDDEA", "\uD83C\uDDF7\uD83C\uDDF4", "\uD83C\uDDF7\uD83C\uDDF8", "\uD83C\uDDF7\uD83C\uDDFA", "\uD83C\uDDF7\uD83C\uDDFC", "\uD83C\uDDF8\uD83C\uDDE6", "\uD83C\uDDF8\uD83C\uDDE7", "\uD83C\uDDF8\uD83C\uDDE8", "\uD83C\uDDF8\uD83C\uDDE9", "\uD83C\uDDF8\uD83C\uDDEA", "\uD83C\uDDF8\uD83C\uDDEC", "\uD83C\uDDF8\uD83C\uDDED", "\uD83C\uDDF8\uD83C\uDDEE", "\uD83C\uDDF8\uD83C\uDDEF", "\uD83C\uDDF8\uD83C\uDDF0", "\uD83C\uDDF8\uD83C\uDDF1", "\uD83C\uDDF8\uD83C\uDDF2", "\uD83C\uDDF8\uD83C\uDDF3", "\uD83C\uDDF8\uD83C\uDDF4", "\uD83C\uDDF8\uD83C\uDDF7", "\uD83C\uDDF8\uD83C\uDDF8", "\uD83C\uDDF8\uD83C\uDDF9", "\uD83C\uDDF8\uD83C\uDDFB", "\uD83C\uDDF8\uD83C\uDDFD", "\uD83C\uDDF8\uD83C\uDDFE", "\uD83C\uDDF8\uD83C\uDDFF", "\uD83C\uDDF9\uD83C\uDDE6", "\uD83C\uDDF9\uD83C\uDDE8", "\uD83C\uDDF9\uD83C\uDDE9", "\uD83C\uDDF9\uD83C\uDDEB", "\uD83C\uDDF9\uD83C\uDDEC", "\uD83C\uDDF9\uD83C\uDDED", "\uD83C\uDDF9\uD83C\uDDEF", "\uD83C\uDDF9\uD83C\uDDF0", "\uD83C\uDDF9\uD83C\uDDF1", "\uD83C\uDDF9\uD83C\uDDF2", "\uD83C\uDDF9\uD83C\uDDF3", "\uD83C\uDDF9\uD83C\uDDF4", "\uD83C\uDDF9\uD83C\uDDF7", "\uD83C\uDDF9\uD83C\uDDF9", "\uD83C\uDDF9\uD83C\uDDFB", "\uD83C\uDDF9\uD83C\uDDFC", "\uD83C\uDDF9\uD83C\uDDFF", "\uD83C\uDDFA\uD83C\uDDE6", "\uD83C\uDDFA\uD83C\uDDEC", "\uD83C\uDDFA\uD83C\uDDF2", "\uD83C\uDDFA\uD83C\uDDF3", "\uD83C\uDDFA\uD83C\uDDF8", "\uD83C\uDDFA\uD83C\uDDFE", "\uD83C\uDDFA\uD83C\uDDFF", "\uD83C\uDDFB\uD83C\uDDE6", "\uD83C\uDDFB\uD83C\uDDE8", "\uD83C\uDDFB\uD83C\uDDEA", "\uD83C\uDDFB\uD83C\uDDEC", "\uD83C\uDDFB\uD83C\uDDEE", "\uD83C\uDDFB\uD83C\uDDF3", "\uD83C\uDDFB\uD83C\uDDFA", "\uD83C\uDDFC\uD83C\uDDEB", "\uD83C\uDDFC\uD83C\uDDF8", "\uD83C\uDDFD\uD83C\uDDF0", "\uD83C\uDDFE\uD83C\uDDEA", "\uD83C\uDDFE\uD83C\uDDF9", "\uD83C\uDDFF\uD83C\uDDE6", "\uD83C\uDDFF\uD83C\uDDF2", "\uD83C\uDDFF\uD83C\uDDFC"];

var FlagsNotation = function (_super) {
  __extends(FlagsNotation, _super);

  function FlagsNotation() {
    return _super.call(this, FLAGS) || this;
  }

  Object.defineProperty(FlagsNotation.prototype, "name", {
    get: function get() {
      return "Flags";
    },
    enumerable: true,
    configurable: true
  });
  return FlagsNotation;
}(CustomNotation);

var YesNoNotation = function (_super) {
  __extends(YesNoNotation, _super);

  function YesNoNotation() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  Object.defineProperty(YesNoNotation.prototype, "name", {
    get: function get() {
      return "YesNo";
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(YesNoNotation.prototype, "negativeInfinite", {
    get: function get() {
      return "YES";
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(YesNoNotation.prototype, "infinite", {
    get: function get() {
      return "YES";
    },
    enumerable: true,
    configurable: true
  });

  YesNoNotation.prototype.formatVerySmallNegativeDecimal = function (x) {
    return x.neq(0) ? "YES" : "NO";
  };

  YesNoNotation.prototype.formatVerySmallDecimal = function (x) {
    return x.neq(0) ? "YES" : "NO";
  };

  YesNoNotation.prototype.formatNegativeUnder1000 = function (x) {
    return x !== 0 ? "YES" : "NO";
  };

  YesNoNotation.prototype.formatUnder1000 = function (x) {
    return x !== 0 ? "YES" : "NO";
  };

  YesNoNotation.prototype.formatNegativeDecimal = function (x) {
    return x.neq(0) ? "YES" : "NO";
  };

  YesNoNotation.prototype.formatDecimal = function (x) {
    return x.neq(0) ? "YES" : "NO";
  };

  return YesNoNotation;
}(Notation);

var scientific$1 = new ScientificNotation();

var EvilNotation = function (_super) {
  __extends(EvilNotation, _super);

  function EvilNotation() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  Object.defineProperty(EvilNotation.prototype, "name", {
    get: function get() {
      return "Evil";
    },
    enumerable: true,
    configurable: true
  });

  EvilNotation.prototype.formatDecimal = function (value, places) {
    var loglog = Math.log(value.log(2)) / Math.log(2);
    var roundedLoglog = Math.round(loglog);
    var adjustedValue;

    if (roundedLoglog < 6 || Math.abs(loglog - roundedLoglog) > 0.25) {
      adjustedValue = value;
    } else {
      adjustedValue = value.pow(roundedLoglog % 2 === 0 ? 2 : 1 / 2);
    }

    return scientific$1.format(adjustedValue, places);
  };

  return EvilNotation;
}(Notation);

export { EvilNotation, FlagsNotation, GreekLettersNotation, JapaneseNotation, MixedLogarithmSciNotation, Notation, OmegaNotation, OmegaShortNotation, PrecisePrimeNotation, Settings, TritetratedNotation, YesNoNotation };
