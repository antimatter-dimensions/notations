import { StandardNotation } from "../standard";

describe("Standard notation", () => {
  const notation = new StandardNotation();

  it("should format values less than 1000 to 0 places", () => {
    expect(notation.format(3, 0, 0)).toBe("3");
    expect(notation.format(34, 0, 0)).toBe("34");
    expect(notation.format(345, 0, 0)).toBe("345");
  });

  it("should format values more than 1e40 to 0 places", () => {
    expect(notation.format(3.45e40, 0)).toBe("35 DDc");
    expect(notation.format(34.5e40, 0)).toBe("345 DDc");
    expect(notation.format(345e40, 0)).toBe("3 TDc");
  });

  it("should format values more than 1e40 to 4 places", () => {
    expect(notation.format(3.4567e40, 0)).toBe("35 DDc");
    expect(notation.format(34.567e40, 0)).toBe("346 DDc");
    expect(notation.format(345.67e40, 0)).toBe("3 TDc");
    expect(notation.format(3456.7e40, 0)).toBe("35 TDc");
  });
});
