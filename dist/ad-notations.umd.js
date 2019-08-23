(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('break_infinity.js/break_infinity')) :
  typeof define === 'function' && define.amd ? define(['exports', 'break_infinity.js/break_infinity'], factory) :
  (global = global || self, factory(global.ADNotations = {}, global.Decimal));
}(this, function (exports, Decimal) { 'use strict';

  Decimal = Decimal && Decimal.hasOwnProperty('default') ? Decimal['default'] : Decimal;

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

  function formatWithCommas(value) {
    return value.toString().replace(/\B(?=([0-9]{3})+(?![0-9]))/g, ",");
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

  var Notation = function () {
    function Notation() {}

    Notation.prototype.format = function (value, places, placesUnder1000) {
      if (typeof value === "number" && !Number.isFinite(value)) {
        return this.infinite;
      }

      var decimal = Decimal.fromValue_noAlloc(value);

      if (decimal.exponent < 3) {
        var number = decimal.toNumber();
        return number < 0 ? this.formatNegativeUnder1000(Math.abs(number), placesUnder1000) : this.formatUnder1000(number, placesUnder1000);
      }

      if (Settings.isInfinite(decimal)) {
        return this.infinite;
      }

      return decimal.sign() < 0 ? this.formatNegativeDecimal(decimal.abs(), places) : this.formatDecimal(decimal, places);
    };

    Object.defineProperty(Notation.prototype, "infinite", {
      get: function get() {
        return "Infinite";
      },
      enumerable: true,
      configurable: true
    });

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

  /*! *****************************************************************************
  Copyright (c) Microsoft Corporation. All rights reserved.
  Licensed under the Apache License, Version 2.0 (the "License"); you may not use
  this file except in compliance with the License. You may obtain a copy of the
  License at http://www.apache.org/licenses/LICENSE-2.0

  THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
  KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
  WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
  MERCHANTABLITY OR NON-INFRINGEMENT.

  See the Apache Version 2.0 License for specific language governing permissions
  and limitations under the License.
  ***************************************************************************** */
  /* global Reflect, Promise */

  var extendStatics = function(d, b) {
      extendStatics = Object.setPrototypeOf ||
          ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
          function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
      return extendStatics(d, b);
  };

  function __extends(d, b) {
      extendStatics(d, b);
      function __() { this.constructor = d; }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  }

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

  var LETTERS = "abcdefghijklmnopqrstuvwxyz";

  var LettersNotation = function (_super) {
    __extends(LettersNotation, _super);

    function LettersNotation() {
      return _super !== null && _super.apply(this, arguments) || this;
    }

    Object.defineProperty(LettersNotation.prototype, "name", {
      get: function get() {
        return "Letters";
      },
      enumerable: true,
      configurable: true
    });

    LettersNotation.prototype.formatDecimal = function (value, places) {
      var engineering = toEngineering(value);
      var mantissa = engineering.mantissa.toFixed(places);
      return mantissa + this.transcribe(engineering.exponent);
    };

    Object.defineProperty(LettersNotation.prototype, "letters", {
      get: function get() {
        return LETTERS;
      },
      enumerable: true,
      configurable: true
    });

    LettersNotation.prototype.transcribe = function (exponent) {
      var normalizedExponent = exponent / 3;
      var base = this.letters.length;

      if (normalizedExponent <= base) {
        return this.letters[normalizedExponent - 1];
      }

      var letters = "";

      while (normalizedExponent > base) {
        var remainder = normalizedExponent % base;
        var letterIndex = (remainder === 0 ? base : remainder) - 1;
        letters = this.letters[letterIndex] + letters;
        normalizedExponent = (normalizedExponent - remainder) / base;

        if (remainder === 0) {
          normalizedExponent--;
        }
      }

      letters = this.letters[normalizedExponent - 1] + letters;
      return letters;
    };

    return LettersNotation;
  }(EngineeringNotation);

  var CANCER = ["😠", "🎂", "🎄", "💀", "🍆", "👪", "🌈", "💯", "🍦", "🎃", "💋", "😂", "🌙", "⛔", "🐙", "💩", "❓", "☢", "🙈", "👍", "☂", "✌", "⚠", "❌", "😋", "⚡"];

  var CancerNotation = function (_super) {
    __extends(CancerNotation, _super);

    function CancerNotation() {
      return _super !== null && _super.apply(this, arguments) || this;
    }

    Object.defineProperty(CancerNotation.prototype, "name", {
      get: function get() {
        return "Cancer";
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(CancerNotation.prototype, "letters", {
      get: function get() {
        return CANCER;
      },
      enumerable: true,
      configurable: true
    });
    return CancerNotation;
  }(LettersNotation);

  var ABBREVIATIONS = ["", "K", "M", "B", "T", "Qa", "Qt", "Sx", "Sp", "Oc", "No", "Dc", "UDc", "DDc", "TDc", "QaDc", "QtDc", "SxDc", "SpDc", "ODc", "NDc", "Vg", "UVg", "DVg", "TVg", "QaVg", "QtVg", "SxVg", "SpVg", "OVg", "NVg", "Tg", "UTg", "DTg", "TTg", "QaTg", "QtTg", "SxTg", "SpTg", "OTg", "NTg", "Qd", "UQd", "DQd", "TQd", "QaQd", "QtQd", "SxQd", "SpQd", "OQd", "NQd", "Qi", "UQi", "DQi", "TQi", "QaQi", "QtQi", "SxQi", "SpQi", "OQi", "NQi", "Se", "USe", "DSe", "TSe", "QaSe", "QtSe", "SxSe", "SpSe", "OSe", "NSe", "St", "USt", "DSt", "TSt", "QaSt", "QtSt", "SxSt", "SpSt", "OSt", "NSt", "Og", "UOg", "DOg", "TOg", "QaOg", "QtOg", "SxOg", "SpOg", "OOg", "NOg", "Nn", "UNn", "DNn", "TNn", "QaNn", "QtNn", "SxNn", "SpNn", "ONn", "NNn", "Ce"];
  var PREFIXES = [["", "U", "D", "T", "Qa", "Qt", "Sx", "Sp", "O", "N"], ["", "Dc", "Vg", "Tg", "Qd", "Qi", "Se", "St", "Og", "Nn"], ["", "Ce", "Dn", "Tc", "Qe", "Qu", "Sc", "Si", "Oe", "Ne"]];
  var PREFIXES_2 = ["", "MI-", "MC-", "NA-", "PC-", "FM-"];

  var StandardNotation = function (_super) {
    __extends(StandardNotation, _super);

    function StandardNotation() {
      return _super !== null && _super.apply(this, arguments) || this;
    }

    Object.defineProperty(StandardNotation.prototype, "name", {
      get: function get() {
        return "Standard";
      },
      enumerable: true,
      configurable: true
    });

    StandardNotation.prototype.formatDecimal = function (value, places) {
      var engineering = toFixedEngineering(value, places);
      var mantissa = engineering.mantissa.toFixed(places);
      var abbreviation = value.exponent <= 303 ? ABBREVIATIONS[engineering.exponent / 3] : this.abbreviate(value.exponent);
      return mantissa + " " + abbreviation;
    };

    StandardNotation.prototype.abbreviate = function (e) {
      e = Math.floor(e / 3) - 1;
      var index2 = 0;
      var prefix = [PREFIXES[0][e % 10]];

      while (e >= 10) {
        e = Math.floor(e / 10);
        prefix.push(PREFIXES[++index2 % 3][e % 10]);
      }

      index2 = Math.floor(index2 / 3);

      while (prefix.length % 3 !== 0) {
        prefix.push("");
      }

      var abbreviation = "";

      while (index2 >= 0) {
        abbreviation += prefix[index2 * 3] + prefix[index2 * 3 + 1] + prefix[index2 * 3 + 2] + PREFIXES_2[index2--];
      }

      if (abbreviation.endsWith("-")) {
        abbreviation = abbreviation.slice(0, abbreviation.length - 1);
      }

      return abbreviation.replace("UM", "M").replace("UNA", "NA").replace("UPC", "PC").replace("UFM", "FM");
    };

    return StandardNotation;
  }(EngineeringNotation);

  var standard = new StandardNotation();
  var scientific = new ScientificNotation();

  var MixedScientificNotation = function (_super) {
    __extends(MixedScientificNotation, _super);

    function MixedScientificNotation() {
      return _super !== null && _super.apply(this, arguments) || this;
    }

    Object.defineProperty(MixedScientificNotation.prototype, "name", {
      get: function get() {
        return "Mixed scientific";
      },
      enumerable: true,
      configurable: true
    });

    MixedScientificNotation.prototype.formatDecimal = function (value, places) {
      var notation = value.exponent >= 33 ? scientific : standard;
      return notation.formatDecimal(value, places);
    };

    return MixedScientificNotation;
  }(Notation);

  var standard$1 = new StandardNotation();
  var engineering = new EngineeringNotation();

  var MixedEngineeringNotation = function (_super) {
    __extends(MixedEngineeringNotation, _super);

    function MixedEngineeringNotation() {
      return _super !== null && _super.apply(this, arguments) || this;
    }

    Object.defineProperty(MixedEngineeringNotation.prototype, "name", {
      get: function get() {
        return "Mixed engineering";
      },
      enumerable: true,
      configurable: true
    });

    MixedEngineeringNotation.prototype.formatDecimal = function (value, places) {
      var notation = value.exponent >= 33 ? engineering : standard$1;
      return notation.formatDecimal(value, places);
    };

    return MixedEngineeringNotation;
  }(Notation);

  var LogarithmNotation = function (_super) {
    __extends(LogarithmNotation, _super);

    function LogarithmNotation() {
      return _super !== null && _super.apply(this, arguments) || this;
    }

    Object.defineProperty(LogarithmNotation.prototype, "name", {
      get: function get() {
        return "Logarithm";
      },
      enumerable: true,
      configurable: true
    });

    LogarithmNotation.prototype.formatDecimal = function (value, places) {
      var log10 = value.log10();

      if (value.exponent < 100000) {
        return "e" + log10.toFixed(Math.max(places, 1));
      }

      if (this.showCommas(value.exponent)) {
        return "e" + formatWithCommas(log10.toFixed(places));
      }

      return "ee" + Math.log10(log10).toFixed(3);
    };

    return LogarithmNotation;
  }(Notation);

  var BracketsNotation = function (_super) {
    __extends(BracketsNotation, _super);

    function BracketsNotation() {
      return _super !== null && _super.apply(this, arguments) || this;
    }

    Object.defineProperty(BracketsNotation.prototype, "name", {
      get: function get() {
        return "Brackets";
      },
      enumerable: true,
      configurable: true
    });

    BracketsNotation.prototype.formatDecimal = function (value) {
      var table = [")", "[", "{", "]", "(", "}"];
      var log6 = Math.LN10 / Math.log(6) * value.log10();
      var wholePartOfLog = Math.floor(log6);
      var decimalPartOfLog = log6 - wholePartOfLog;
      var decimalPartTimes36 = Math.floor(decimalPartOfLog * 36);
      var string = "";

      while (wholePartOfLog >= 6) {
        var remainder = wholePartOfLog % 6;
        wholePartOfLog -= remainder;
        wholePartOfLog /= 6;
        string = table[remainder] + string;
      }

      string = "e" + table[wholePartOfLog] + string + ".";
      string += table[Math.floor(decimalPartTimes36 / 6)];
      string += table[decimalPartTimes36 % 6];
      return string;
    };

    return BracketsNotation;
  }(Notation);

  var LOG10_MAX_VALUE = Math.log10(Number.MAX_VALUE);

  var InfinityNotation = function (_super) {
    __extends(InfinityNotation, _super);

    function InfinityNotation() {
      return _super !== null && _super.apply(this, arguments) || this;
    }

    Object.defineProperty(InfinityNotation.prototype, "name", {
      get: function get() {
        return "Infinity";
      },
      enumerable: true,
      configurable: true
    });

    InfinityNotation.prototype.formatDecimal = function (value, places) {
      var log10 = value.log10();
      var infinities = log10 / LOG10_MAX_VALUE;
      var infPlaces = infinities < 1000 ? 4 : 3;
      var formatted = infinities.toFixed(Math.max(infPlaces, places));

      if (Settings.exponentCommas.show) {
        var parts = formatted.split(".");
        return formatWithCommas(parts[0]) + "." + parts[1] + "\u221E";
      }

      return formatted + "\u221E";
    };

    return InfinityNotation;
  }(Notation);

  var ROMAN_NUMBERS = [[1000000, "M̄"], [900000, "C̄M̄"], [500000, "D̄"], [400000, "C̄D̄"], [100000, "C̄"], [90000, "X̄C̄"], [50000, "L̄"], [40000, "X̄L̄"], [10000, "X̄"], [9000, "ⅯX̄"], [5000, "V̄"], [4000, "ⅯV̄"], [1000, "Ⅿ"], [900, "ⅭⅯ"], [500, "Ⅾ"], [400, "ⅭⅮ"], [100, "Ⅽ"], [90, "ⅩⅭ"], [50, "Ⅼ"], [40, "ⅩⅬ"], [10, "Ⅹ"], [9, "ⅠⅩ"], [5, "Ⅴ"], [4, "ⅠⅤ"], [1, "Ⅰ"]];
  var ROMAN_FRACTIONS = ["", "·", ":", "∴", "∷", "⁙"];
  var MAXIMUM = 4000000;
  var MAX_LOG_10 = Math.log10(MAXIMUM);

  var RomanNotation = function (_super) {
    __extends(RomanNotation, _super);

    function RomanNotation() {
      return _super !== null && _super.apply(this, arguments) || this;
    }

    Object.defineProperty(RomanNotation.prototype, "name", {
      get: function get() {
        return "Roman";
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(RomanNotation.prototype, "infinite", {
      get: function get() {
        return "Infinitus";
      },
      enumerable: true,
      configurable: true
    });

    RomanNotation.prototype.formatUnder1000 = function (value) {
      return this.romanize(value);
    };

    RomanNotation.prototype.formatDecimal = function (value) {
      if (value.lt(MAXIMUM)) {
        return this.romanize(value.toNumber());
      }

      var log10 = value.log10();
      var maximums = log10 / MAX_LOG_10;
      var current = Math.pow(MAXIMUM, maximums - Math.floor(maximums));
      return this.romanize(current) + "\u2191" + this.formatDecimal(new Decimal(maximums));
    };

    RomanNotation.prototype.romanize = function (value) {
      var romanized = "";

      for (var _i = 0, ROMAN_NUMBERS_1 = ROMAN_NUMBERS; _i < ROMAN_NUMBERS_1.length; _i++) {
        var numberPair = ROMAN_NUMBERS_1[_i];
        var decimal = numberPair[0];
        var roman = numberPair[1];

        while (decimal <= value) {
          romanized += roman;
          value -= decimal;
        }
      }

      var duodecimal = Math.round(Math.floor(value * 10) * 1.2);

      if (duodecimal === 0) {
        return romanized === "" ? "nulla" : romanized;
      }

      if (duodecimal > 5) {
        duodecimal -= 6;
        romanized += "Ｓ";
      }

      romanized += ROMAN_FRACTIONS[duodecimal];
      return romanized;
    };

    return RomanNotation;
  }(Notation);

  var DOT_DIGITS = "⠀⠁⠂⠃⠄⠅⠆⠇⠈⠉⠊⠋⠌⠍⠎⠏⠐⠑⠒⠓⠔⠕⠖⠗⠘⠙⠚⠛⠜⠝⠞⠟⠠⠡⠢⠣⠤⠥⠦⠧⠨⠩⠪⠫⠬⠭⠮⠯⠰⠱⠲⠳⠴⠵⠶⠷⠸⠹⠺⠻⠼⠽⠾⠿" + "⡀⡁⡂⡃⡄⡅⡆⡇⡈⡉⡊⡋⡌⡍⡎⡏⡐⡑⡒⡓⡔⡕⡖⡗⡘⡙⡚⡛⡜⡝⡞⡟⡠⡡⡢⡣⡤⡥⡦⡧⡨⡩⡪⡫⡬⡭⡮⡯⡰⡱⡲⡳⡴⡵⡶⡷⡸⡹⡺⡻⡼⡽⡾⡿" + "⢀⢁⢂⢃⢄⢅⢆⢇⢈⢉⢊⢋⢌⢍⢎⢏⢐⢑⢒⢓⢔⢕⢖⢗⢘⢙⢚⢛⢜⢝⢞⢟⢠⢡⢢⢣⢤⢥⢦⢧⢨⢩⢪⢫⢬⢭⢮⢯⢰⢱⢲⢳⢴⢵⢶⢷⢸⢹⢺⢻⢼⢽⢾⢿" + "⣀⣁⣂⣃⣄⣅⣆⣇⣈⣉⣊⣋⣌⣍⣎⣏⣐⣑⣒⣓⣔⣕⣖⣗⣘⣙⣚⣛⣜⣝⣞⣟⣠⣡⣢⣣⣤⣥⣦⣧⣨⣩⣪⣫⣬⣭⣮⣯⣰⣱⣲⣳⣴⣵⣶⣷⣸⣹⣺⣻⣼⣽⣾⣿";

  var DotsNotation = function (_super) {
    __extends(DotsNotation, _super);

    function DotsNotation() {
      return _super !== null && _super.apply(this, arguments) || this;
    }

    Object.defineProperty(DotsNotation.prototype, "name", {
      get: function get() {
        return "Dots";
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(DotsNotation.prototype, "infinite", {
      get: function get() {
        return "⣿⠀⣿";
      },
      enumerable: true,
      configurable: true
    });

    DotsNotation.prototype.formatUnder1000 = function (value) {
      return this.dotify(value * 254);
    };

    DotsNotation.prototype.formatDecimal = function (value) {
      if (value.lt(16387063.9980315)) {
        return this.dotify(value.toNumber() * 254);
      }

      var log = value.log(254);
      var exponent = Math.floor(log - 2);
      var mantissa = Math.pow(254, log - exponent);
      return this.dotify(exponent) + "\u28FF" + this.dotify(mantissa * 254);
    };

    DotsNotation.prototype.dotify = function (value, pad) {
      if (pad === void 0) {
        pad = false;
      }

      value = Math.round(value);

      if (!pad && value < 254) {
        return DOT_DIGITS[value + 1];
      }

      if (value < 64516) {
        return DOT_DIGITS[Math.floor(value / 254) + 1] + DOT_DIGITS[value % 254 + 1];
      }

      return this.dotify(Math.floor(value / 64516)) + this.dotify(value % 64516, true);
    };

    return DotsNotation;
  }(Notation);

  var ZALGO_CHARS = ["\u030D", "\u0336", "\u0353", "\u033F", "\u0489", "\u0330", "\u031A", "\u0338", "\u035A", "\u0337"];
  var HE_COMES = ["H", "E", " ", "C", "O", "M", "E", "S"];

  function randomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  var ZalgoNotation = function (_super) {
    __extends(ZalgoNotation, _super);

    function ZalgoNotation() {
      return _super !== null && _super.apply(this, arguments) || this;
    }

    Object.defineProperty(ZalgoNotation.prototype, "name", {
      get: function get() {
        return "Zalgo";
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(ZalgoNotation.prototype, "infinite", {
      get: function get() {
        return HE_COMES.map(function (_char) {
          return _char + randomElement(ZALGO_CHARS);
        }).join("");
      },
      enumerable: true,
      configurable: true
    });

    ZalgoNotation.prototype.formatUnder1000 = function (value) {
      return this.heComes(new Decimal(value));
    };

    ZalgoNotation.prototype.formatDecimal = function (value) {
      return this.heComes(value);
    };

    ZalgoNotation.prototype.heComes = function (value) {
      var scaled = value.plus(1).log10() / 66666 * 1000;
      var displayPart = Number(scaled.toFixed(2));
      var zalgoPart = Math.floor(Math.abs(Math.pow(2, 30) * (scaled - displayPart)));
      var displayChars = Array.from(formatWithCommas(displayPart));
      var zalgoIndices = Array.from(zalgoPart.toString() + scaled.toFixed(0));

      for (var i = 0; i < zalgoIndices.length; i++) {
        var zalgoIndex = parseInt(zalgoIndices[i], 10);
        var displayIndex = 37 * i % displayChars.length;
        displayChars[displayIndex] += ZALGO_CHARS[zalgoIndex];
      }

      return displayChars.join("");
    };

    return ZalgoNotation;
  }(Notation);

  var SIGNS = {
    POSITIVE: 0,
    NEGATIVE: 1
  };

  var HexNotation = function (_super) {
    __extends(HexNotation, _super);

    function HexNotation() {
      return _super !== null && _super.apply(this, arguments) || this;
    }

    Object.defineProperty(HexNotation.prototype, "name", {
      get: function get() {
        return "Hex";
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(HexNotation.prototype, "infinite", {
      get: function get() {
        return "FFFFFFFF";
      },
      enumerable: true,
      configurable: true
    });

    HexNotation.prototype.formatNegativeUnder1000 = function (value) {
      return this.formatDecimal(new Decimal(-value));
    };

    HexNotation.prototype.formatNegativeDecimal = function (value) {
      return this.formatDecimal(value.negate());
    };

    HexNotation.prototype.formatUnder1000 = function (value) {
      return this.formatDecimal(new Decimal(value));
    };

    HexNotation.prototype.formatDecimal = function (value) {
      return this.rawValue(value, 32, 8).toString(16).toUpperCase().padStart(8, "0");
    };

    HexNotation.prototype.modifiedLogarithm = function (x) {
      var floorOfLog = Math.floor(Decimal.log2(x));
      var previousPowerOfTwo = Decimal.pow(2, floorOfLog);
      var fractionToNextPowerOfTwo = Decimal.div(x, previousPowerOfTwo).toNumber() - 1;
      return floorOfLog + fractionToNextPowerOfTwo;
    };

    HexNotation.prototype.rawValue = function (value, numberOfBits, extraPrecisionForRounding) {
      return this.getValueFromSigns(this.getSigns(value, numberOfBits, extraPrecisionForRounding), numberOfBits);
    };

    HexNotation.prototype.isFinite = function (x) {
      if (typeof x === "number") {
        return isFinite(x);
      }

      return isFinite(x.e) && isFinite(x.mantissa);
    };

    HexNotation.prototype.getSigns = function (value, numberOfBits, extraPrecisionForRounding) {
      var signs = [];

      for (var i = 0; i < numberOfBits + extraPrecisionForRounding; i++) {
        if (!this.isFinite(value)) {
          break;
        }

        if (Decimal.lt(value, 0)) {
          signs.push(SIGNS.NEGATIVE);
          value = Decimal.times(value, -1);
        } else {
          signs.push(SIGNS.POSITIVE);
        }

        value = this.modifiedLogarithm(value);
      }

      return signs;
    };

    HexNotation.prototype.getValueFromSigns = function (signs, numberOfBits) {
      var result = 0;

      for (var i = signs.length - 1; i >= 0; i--) {
        if (signs[i] === SIGNS.NEGATIVE) {
          result = 1 / 2 - result / 2;
        } else {
          result = 1 / 2 + result / 2;
        }
      }

      return Math.round(result * Math.pow(2, numberOfBits));
    };

    return HexNotation;
  }(Notation);

  var VOLUME_UNITS = [[0, "pL", 0], [61611520, "minim", 0], [61611520 * 60, "dram", 1], [61611520 * 60 * 8, "ounce", 2], [61611520 * 60 * 8 * 4, "gill", 2], [61611520 * 60 * 8 * 4 * 2, "cup", 3], [61611520 * 60 * 8 * 4 * 2 * 2, "pint", 4], [61611520 * 60 * 8 * 4 * 2 * 2 * 2, "quart", 4], [61611520 * 60 * 8 * 4 * 2 * 2 * 2 * 4, "gallon", 4], [61611520 * 60 * 8 * 4 * 2 * 2 * 2 * 4 * 4.5, "pin", 3], [61611520 * 60 * 8 * 4 * 2 * 2 * 2 * 4 * 9, "firkin", 3], [61611520 * 60 * 8 * 4 * 2 * 2 * 2 * 4 * 18, "kilderkin", 4], [61611520 * 60 * 8 * 4 * 2 * 2 * 2 * 4 * 36, "barrel", 4], [61611520 * 60 * 8 * 4 * 2 * 2 * 2 * 4 * 54, "hogshead", 5], [61611520 * 60 * 8 * 4 * 2 * 2 * 2 * 4 * 72, "puncheon", 6], [61611520 * 60 * 8 * 4 * 2 * 2 * 2 * 4 * 108, "butt", 7], [61611520 * 60 * 8 * 4 * 2 * 2 * 2 * 4 * 216, "tun", 7]];
  var MINIMS = VOLUME_UNITS[1];
  var VOLUME_ADJECTIVES = ["minute ", "tiny ", "petite ", "small ", "modest ", "medium ", "generous ", "large ", "great ", "huge ", "gigantic ", "colossal ", "vast ", "cosmic "];
  var VOWELS = new Set("aeiouAEIOU");
  var MAX_VOLUME = 10 * VOLUME_UNITS[VOLUME_UNITS.length - 1][0];
  var LOG_MAX_VOLUME = Math.log10(MAX_VOLUME);
  var REDUCE_RATIO = Math.log10(MAX_VOLUME / MINIMS[0]);

  var ImperialNotation = function (_super) {
    __extends(ImperialNotation, _super);

    function ImperialNotation() {
      return _super !== null && _super.apply(this, arguments) || this;
    }

    Object.defineProperty(ImperialNotation.prototype, "name", {
      get: function get() {
        return "Imperial";
      },
      enumerable: true,
      configurable: true
    });

    ImperialNotation.prototype.formatUnder1000 = function (value) {
      return this.formatDecimal(new Decimal(value));
    };

    ImperialNotation.prototype.formatDecimal = function (value) {
      if (value.lt(MAX_VOLUME)) {
        return this.convertToVolume(value.toNumber(), VOLUME_ADJECTIVES[0]);
      }

      var logValue = value.log10() - LOG_MAX_VOLUME;
      var adjectiveIndex = 1;

      while (logValue > REDUCE_RATIO) {
        adjectiveIndex++;
        logValue /= REDUCE_RATIO;
      }

      return this.convertToVolume(Math.pow(10, logValue) * MINIMS[0], VOLUME_ADJECTIVES[adjectiveIndex]);
    };

    ImperialNotation.prototype.convertToVolume = function (x, adjective) {
      var volIdx = this.findVolumeUnit(x);

      if (volIdx === 0) {
        return this.formatMetric(x);
      }

      var smallStr = this.checkSmallUnits(adjective, x, volIdx);

      if (smallStr !== undefined) {
        return smallStr;
      }

      var big = VOLUME_UNITS[volIdx];
      var numBig = Math.floor(x / big[0]);
      var remainder = x - numBig * big[0];

      if (volIdx < VOLUME_UNITS.length - 1) {
        var volume = this.checkAlmost(adjective, x, 0, volIdx + 1);

        if (volume !== undefined) {
          return volume;
        }
      }

      var nearMultiple = this.checkAlmost(adjective, remainder, numBig, volIdx);

      if (nearMultiple !== undefined) {
        return nearMultiple;
      }

      if (remainder < VOLUME_UNITS[volIdx - big[2]][0]) {
        return this.pluralOrArticle(numBig, adjective + big[1]);
      }

      var numBest = Math.floor(remainder / VOLUME_UNITS[volIdx - 1][0]);
      var bestUnitIndex = volIdx - 1;
      var bestUnitError = remainder - numBest * VOLUME_UNITS[volIdx - 1][0];

      for (var thirdUnitIndex = volIdx - 2; thirdUnitIndex > 0 && thirdUnitIndex > volIdx - big[2]; --thirdUnitIndex) {
        var third = VOLUME_UNITS[thirdUnitIndex];
        var numThird = Math.floor(remainder / third[0]);

        if (numThird > 9 && thirdUnitIndex !== 1) {
          break;
        }

        var thirdUnitError = remainder - numThird * third[0];

        if (thirdUnitError < 0.99 * bestUnitError) {
          numBest = numThird;
          bestUnitIndex = thirdUnitIndex;
          bestUnitError = thirdUnitError;
        }
      }

      return this.bigAndSmall(adjective, numBig, big, numBest, VOLUME_UNITS[bestUnitIndex]);
    };

    ImperialNotation.prototype.formatMetric = function (x) {
      if (x < 1000) {
        return (x < 10 || x === Math.round(x) ? x.toFixed(2) : x.toFixed(0)) + "pL";
      }

      if (x < 1e6) {
        return (x / 1000).toPrecision(4) + "nL";
      }

      return (x / 1e6).toPrecision(4) + "\u03BCL";
    };

    ImperialNotation.prototype.checkSmallUnits = function (adjective, x, volIdx) {
      var big = VOLUME_UNITS[volIdx];

      if (volIdx <= 3 && x + 9.5 * MINIMS[0] > VOLUME_UNITS[volIdx + 1][0]) {
        return this.almostOrShortOf(x, adjective, 1, VOLUME_UNITS[volIdx + 1], MINIMS);
      }

      if (volIdx === 1) {
        var deciMinims = Math.round(x * 10 / big[0]);

        if (deciMinims === 10) {
          return this.addArticle(adjective + big[1]);
        }

        var places = deciMinims < 100 ? 1 : 0;
        return (deciMinims / 10).toFixed(places) + " " + adjective + big[1] + "s";
      }

      if (volIdx === 2) {
        var numBig = Math.floor(x / big[0]);
        var remainder = x - numBig * big[0];

        if (remainder > 50.5 * MINIMS[0]) {
          return this.almostOrShortOf(x, adjective, numBig + 1, big, MINIMS);
        }

        var numSmall = Math.round(remainder / MINIMS[0]);
        return this.bigAndSmall(adjective, numBig, big, numSmall, MINIMS);
      }

      return undefined;
    };

    ImperialNotation.prototype.findVolumeUnit = function (x) {
      var low = 0;
      var high = VOLUME_UNITS.length;
      var guess;

      while (high - low > 1) {
        guess = Math.floor((low + high) / 2);

        if (VOLUME_UNITS[guess][0] > x) {
          high = guess;
        } else {
          low = guess;
        }
      }

      return low;
    };

    ImperialNotation.prototype.checkAlmost = function (adjective, x, numBig, bigIndex) {
      var big = VOLUME_UNITS[bigIndex];

      if (x + VOLUME_UNITS[bigIndex - big[2]][0] >= big[0]) {
        return this.almost(adjective, numBig + 1, big);
      }

      var small = VOLUME_UNITS[bigIndex + 1 - big[2]];

      if (x + small[0] >= big[0]) {
        return this.shortOf(adjective, numBig + 1, big, 1, small);
      }

      return undefined;
    };

    ImperialNotation.prototype.bigAndSmall = function (adjective, numBig, big, numSmall, small) {
      var bigStr = this.pluralOrArticle(numBig, adjective + big[1]);
      return numSmall === 0 ? bigStr : bigStr + " and " + this.pluralOrArticle(numSmall, small[1]);
    };

    ImperialNotation.prototype.almost = function (adjective, numBig, big) {
      return "almost " + this.pluralOrArticle(numBig, adjective + big[1]);
    };

    ImperialNotation.prototype.almostOrShortOf = function (x, adjective, numBig, big, small) {
      var _short = Math.round((numBig * big[0] - x) / small[0]);

      return _short === 0 ? this.almost(adjective, numBig, big) : this.shortOf(adjective, numBig, big, _short, small);
    };

    ImperialNotation.prototype.shortOf = function (adjective, numBig, big, numSmall, small) {
      return this.pluralOrArticle(numSmall, small[1]) + " short of " + this.pluralOrArticle(numBig, adjective + big[1]);
    };

    ImperialNotation.prototype.pluralOrArticle = function (num, str) {
      return num === 1 ? this.addArticle(str) : num + " " + str + "s";
    };

    ImperialNotation.prototype.addArticle = function (x) {
      return (VOWELS.has(x[0]) ? "an " : "a ") + x;
    };

    return ImperialNotation;
  }(Notation);

  var HOURS = ["🕛", "🕐", "🕑", "🕒", "🕓", "🕔", "🕕", "🕖", "🕗", "🕘", "🕙", "🕚"];
  var LOG12 = Math.log10(12);

  var ClockNotation = function (_super) {
    __extends(ClockNotation, _super);

    function ClockNotation() {
      return _super !== null && _super.apply(this, arguments) || this;
    }

    Object.defineProperty(ClockNotation.prototype, "name", {
      get: function get() {
        return "Clock";
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(ClockNotation.prototype, "infinite", {
      get: function get() {
        return "🕛🕡";
      },
      enumerable: true,
      configurable: true
    });

    ClockNotation.prototype.formatUnder1000 = function (value) {
      return this.clockwise(new Decimal(value));
    };

    ClockNotation.prototype.formatDecimal = function (value) {
      return this.clockwise(value);
    };

    ClockNotation.prototype.clockwise = function (value) {
      if (value.lt(12)) {
        return this.hour(value.toNumber());
      }

      var log = value.log10() / LOG12;
      var exponent = Math.floor(log);

      if (log < 301) {
        var clockLow = (Math.pow(12, log - exponent + 1) - 12) / 11;

        if (exponent < 13) {
          return this.hour(exponent - 1) + this.hour(clockLow);
        }

        exponent -= 13;
        var prefix = "";

        if (exponent >= 144) {
          prefix = this.hour(0);
          exponent -= 144;
        }

        return prefix + this.hour(exponent / 12) + this.hour(exponent % 12) + this.hour(clockLow);
      }

      exponent -= 301;
      var clockHigh = 1;

      while (exponent >= 1728) {
        exponent = (exponent - 1728) / 12;
        ++clockHigh;
      }

      return this.hour(clockHigh) + this.hour(exponent / 144) + this.hour(exponent % 144 / 12) + this.hour(exponent % 12);
    };

    ClockNotation.prototype.hour = function (number) {
      return HOURS[Math.max(Math.min(Math.floor(number), 11), 0)];
    };

    return ClockNotation;
  }(Notation);

  var MAX_INT = Number.MAX_SAFE_INTEGER;
  var MAX_INT_DECIMAL = new Decimal(MAX_INT);
  var MAX_INT_LOG_10 = Math.log10(MAX_INT);
  var MAX_FACTOR = 10000;
  var EXPONENT_CHARACTERS = ["\u2070", "\xB9", "\xB2", "\xB3", "\u2074", "\u2075", "\u2076", "\u2077", "\u2078", "\u2079"];

  var PrimeNotation = function (_super) {
    __extends(PrimeNotation, _super);

    function PrimeNotation() {
      return _super !== null && _super.apply(this, arguments) || this;
    }

    Object.defineProperty(PrimeNotation.prototype, "name", {
      get: function get() {
        return "Prime";
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(PrimeNotation.prototype, "infinite", {
      get: function get() {
        return "Primefinity?";
      },
      enumerable: true,
      configurable: true
    });

    PrimeNotation.prototype.formatUnder1000 = function (value) {
      return this.primify(new Decimal(value));
    };

    PrimeNotation.prototype.formatDecimal = function (value) {
      return this.primify(value);
    };

    PrimeNotation.prototype.primify = function (value) {
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

    PrimeNotation.prototype.maybeParenthesize = function (x, b) {
      return b ? "(" + x + ")" : x;
    };

    PrimeNotation.prototype.formatPowerTower = function (exps) {
      var _this = this;

      var factorizations = exps.map(function (x) {
        return _this.primesFromInt(x);
      });
      var superscriptLastExponent = factorizations[exps.length - 1].length === 1;
      var parenthesize = factorizations.map(function (x, i) {
        return x[0] !== x[x.length - 1] || i === exps.length - 2 && x.length > 1 && superscriptLastExponent;
      });
      var formattedExps = factorizations.map(function (x, i) {
        return _this.maybeParenthesize(i === exps.length - 1 && superscriptLastExponent ? _this.convertToExponent(x[0]) : _this.formatFromList(x), parenthesize[i]);
      });

      if (superscriptLastExponent) {
        var superscript = formattedExps.pop();
        formattedExps[exps.length - 2] += superscript;
      }

      return formattedExps.join('^');
    };

    PrimeNotation.prototype.convertToExponent = function (exp) {
      var s = [];

      for (; exp > 0; exp = Math.floor(exp / 10)) {
        s.push(EXPONENT_CHARACTERS[exp % 10]);
      }

      return s.reverse().join("");
    };

    PrimeNotation.prototype.formatFromList = function (factors) {
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
              out.push("" + last + this.convertToExponent(count));
            } else {
              out.push(last);
            }
          }

          last = i;
          count = 1;
        }
      }

      if (count > 1) {
        out.push("" + last + this.convertToExponent(count));
      } else {
        out.push(last);
      }

      return out.join("\xD7");
    };

    PrimeNotation.prototype.primesFromInt = function (n) {
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

    return PrimeNotation;
  }(Notation);

  var BARS = ["", "", "", "", "", "", "", ""];
  var LOG8 = Math.log(8);

  var BarNotation = function (_super) {
    __extends(BarNotation, _super);

    function BarNotation() {
      return _super !== null && _super.apply(this, arguments) || this;
    }

    Object.defineProperty(BarNotation.prototype, "name", {
      get: function get() {
        return "Bar";
      },
      enumerable: true,
      configurable: true
    });

    BarNotation.prototype.formatDecimal = function (value) {
      var log8 = Math.LN10 / LOG8 * value.log10();
      var wholeLog = Math.floor(log8);
      var decimalLog = log8 - wholeLog;
      var decimalLog64 = Math.floor(decimalLog * 64);
      var parts = [BARS[decimalLog64 % 8], BARS[Math.floor(decimalLog64 / 8)]];

      while (wholeLog >= 8) {
        var remainder = wholeLog % 8;
        wholeLog = (wholeLog - remainder) / 8;
        parts.push(BARS[remainder]);
      }

      parts.push(BARS[wholeLog]);
      return parts.join("");
    };

    return BarNotation;
  }(Notation);

  var SHI = "世使侍勢十史嗜士始室實屍市恃拭拾施是時氏濕獅矢石視試詩誓識逝適釋食";

  var ShiNotation = function (_super) {
    __extends(ShiNotation, _super);

    function ShiNotation() {
      return _super !== null && _super.apply(this, arguments) || this;
    }

    Object.defineProperty(ShiNotation.prototype, "name", {
      get: function get() {
        return "Shi";
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(ShiNotation.prototype, "infinite", {
      get: function get() {
        return this.shi(Decimal.NUMBER_MAX_VALUE);
      },
      enumerable: true,
      configurable: true
    });

    ShiNotation.prototype.formatUnder1000 = function (value) {
      return this.shi(new Decimal(value));
    };

    ShiNotation.prototype.formatDecimal = function (value) {
      return this.shi(value);
    };

    ShiNotation.prototype.getShiCharacter = function (x) {
      return SHI[Math.floor(x) % SHI.length];
    };

    ShiNotation.prototype.shi = function (value) {
      var scaled = Math.pow(value.plus(1).log10() * 1000, 0.08);
      var shi = "";

      for (var i = 0; i < 3; i++) {
        shi += this.getShiCharacter(scaled * Math.pow(SHI.length, i));
      }

      return shi;
    };

    return ShiNotation;
  }(Notation);

  var BlindNotation = function (_super) {
    __extends(BlindNotation, _super);

    function BlindNotation() {
      return _super !== null && _super.apply(this, arguments) || this;
    }

    Object.defineProperty(BlindNotation.prototype, "name", {
      get: function get() {
        return "Blind";
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(BlindNotation.prototype, "infinite", {
      get: function get() {
        return " ";
      },
      enumerable: true,
      configurable: true
    });

    BlindNotation.prototype.formatNegativeUnder1000 = function () {
      return " ";
    };

    BlindNotation.prototype.formatUnder1000 = function () {
      return " ";
    };

    BlindNotation.prototype.formatNegativeDecimal = function () {
      return " ";
    };

    BlindNotation.prototype.formatDecimal = function () {
      return " ";
    };

    return BlindNotation;
  }(Notation);

  exports.BarNotation = BarNotation;
  exports.BlindNotation = BlindNotation;
  exports.BracketsNotation = BracketsNotation;
  exports.CancerNotation = CancerNotation;
  exports.ClockNotation = ClockNotation;
  exports.DotsNotation = DotsNotation;
  exports.EngineeringNotation = EngineeringNotation;
  exports.HexNotation = HexNotation;
  exports.ImperialNotation = ImperialNotation;
  exports.InfinityNotation = InfinityNotation;
  exports.LettersNotation = LettersNotation;
  exports.LogarithmNotation = LogarithmNotation;
  exports.MixedEngineeringNotation = MixedEngineeringNotation;
  exports.MixedScientificNotation = MixedScientificNotation;
  exports.Notation = Notation;
  exports.PrimeNotation = PrimeNotation;
  exports.RomanNotation = RomanNotation;
  exports.ScientificNotation = ScientificNotation;
  exports.Settings = Settings;
  exports.ShiNotation = ShiNotation;
  exports.StandardNotation = StandardNotation;
  exports.ZalgoNotation = ZalgoNotation;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
