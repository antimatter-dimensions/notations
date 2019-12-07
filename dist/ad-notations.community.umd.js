(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('break_infinity.js/break_infinity')) :
  typeof define === 'function' && define.amd ? define(['exports', 'break_infinity.js/break_infinity'], factory) :
  (global = global || self, factory(global.ADCommunityNotations = {}, global.Decimal));
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

  exports.Notation = Notation;
  exports.Settings = Settings;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
