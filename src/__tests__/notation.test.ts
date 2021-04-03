import Decimal from "break_infinity.js";
import { Notation } from "../notation";

describe("Abstract Notation", () => {
  class TestNotation extends Notation {
    public readonly name = "Test";

    public formatDecimal(value: Decimal, places: number): string {
      return value.toStringWithDecimalPlaces(places);
    }
  }

  const notation = new TestNotation();

  describe("name getter", () => {
    it("should return the custom name", () => {
      expect(notation.name).toBe("Test");
    });
  });

  describe("negativeInfinite getter", () => {
    it("should return the default value", () => {
      expect(notation.negativeInfinite).toBe("-Infinite");
    });
  });

  describe("infinite getter", () => {
    it("should return the default value", () => {
      expect(notation.infinite).toBe("Infinite");
    });
  });

  describe("#format method", () => {
    it("should format positive number values", () => {
      expect(notation.format(3)).toBe("3");
      expect(notation.format(34)).toBe("34");
      expect(notation.format(345)).toBe("345");
    });

    it("should format negative number values", () => {
      expect(notation.format(-3)).toBe("-3");
      expect(notation.format(-34)).toBe("-34");
      expect(notation.format(-345)).toBe("-345");
    });

    it("should format positive string values", () => {
      expect(notation.format("3")).toBe("3");
      expect(notation.format("34")).toBe("34");
      expect(notation.format("345")).toBe("345");
    });

    it("should format negative string values", () => {
      expect(notation.format("-3")).toBe("-3");
      expect(notation.format("-34")).toBe("-34");
      expect(notation.format("-345")).toBe("-345");
    });

    it("should format positive Decimal values", () => {
      expect(notation.format(new Decimal("3"))).toBe("3");
      expect(notation.format(new Decimal(34))).toBe("34");
    });

    it("should format negative Decimal values", () => {
      expect(notation.format(new Decimal("-3"))).toBe("-3");
      expect(notation.format(new Decimal(-34))).toBe("-34");
    });

    describe("with places", () => {
      it("should format a positive value to the specified places", () => {
        const num = 1.2345e3;
        expect(notation.format(num, 0)).toBe("1e+3");
        expect(notation.format(num, 1)).toBe("1.2e+3");
        expect(notation.format(num, 2)).toBe("1.23e+3");
      });

      it("should format a negative value to the specified places", () => {
        const num = -1.2345e3;
        expect(notation.format(num, 0)).toBe("-1e+3");
        expect(notation.format(num, 1)).toBe("-1.2e+3");
        expect(notation.format(num, 2)).toBe("-1.23e+3");
      });
    });

    describe("with placesUnder1000", () => {
      it("should format a value under 1000", () => {
        const num = 123.456;

        expect(notation.format(num, 0, 0)).toBe("123");
        expect(notation.format(num, 0, 1)).toBe("123.5");
        expect(notation.format(num, 0, 2)).toBe("123.46");
      });

      it("should format a value above -1000", () => {
        const num = -123.456;

        expect(notation.format(num, 0, 0)).toBe("-123");
        expect(notation.format(num, 0, 1)).toBe("-123.5");
        expect(notation.format(num, 0, 2)).toBe("-123.46");
      });

      it("should have no effect on a value above 1000", () => {
        const num = 1234.567;

        expect(notation.format(num, 0, 0)).toBe("1e+3");
        expect(notation.format(num, 0, 1)).toBe("1e+3");
        expect(notation.format(num, 0, 2)).toBe("1e+3");
        expect(notation.format(num, 1, 0)).toBe("1.2e+3");
        expect(notation.format(num, 1, 1)).toBe("1.2e+3");
        expect(notation.format(num, 1, 2)).toBe("1.2e+3");
      });

      it("should have no effect on a value below -1000", () => {
        const num = -1234.567;

        expect(notation.format(num, 0, 0)).toBe("-1e+3");
        expect(notation.format(num, 0, 1)).toBe("-1e+3");
        expect(notation.format(num, 0, 2)).toBe("-1e+3");
        expect(notation.format(num, 1, 0)).toBe("-1.2e+3");
        expect(notation.format(num, 1, 1)).toBe("-1.2e+3");
        expect(notation.format(num, 1, 2)).toBe("-1.2e+3");
      });
    });
  });
});
