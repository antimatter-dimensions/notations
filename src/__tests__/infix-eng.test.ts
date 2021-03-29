import { InfixEngineeringNotation } from '../community/infix-eng';

describe("Infix engineering notation", () => {
  const notation = new InfixEngineeringNotation();

  it("should format less than 1000 to 0 places", () => {
    expect(notation.format(3, 0)).toBe("3₀");
    expect(notation.format(34, 0)).toBe("34₀");
    expect(notation.format(345, 0)).toBe("345₀");
    expect(notation.format(3.45, 0)).toBe("3₀");
    expect(notation.format(34.6, 0)).toBe("35₀");
    expect(notation.format(34.5, 0)).toBe("35₀"); // Is the rounding right??
    expect(notation.format(33.5, 0)).toBe("34₀"); // Is the rounding right??
    expect(notation.format(34.4, 0)).toBe("34₀");
  });

  it("should format less than 1000 to 1 places", () => {
    expect(notation.format(3, 1)).toBe("3₀0");
    expect(notation.format(34, 1)).toBe("34₀");
    expect(notation.format(345, 1)).toBe("345₀");
    expect(notation.format(3.45, 1)).toBe("3₀5");
    expect(notation.format(34.5, 1)).toBe("35₀");
  });

  it("should format less than 1000 to 2 places", () => {
    expect(notation.format(3, 2)).toBe("3₀00");
    expect(notation.format(34, 2)).toBe("34₀0");
    expect(notation.format(345, 2)).toBe("345₀");
    expect(notation.format(3.45, 2)).toBe("3₀45");
    expect(notation.format(34.5, 2)).toBe("34₀5");
  });

  it("should format less than 1 to 0 places", () => {
    expect(notation.format(0.3, 0)).toBe("₀3");
    expect(notation.format(0.34, 0)).toBe("₀3");
    expect(notation.format(0.345, 0)).toBe("₀3");
    expect(notation.format(0.3456, 0)).toBe("₀3");
    expect(notation.format(0.01, 0)).toBe("10₋₃");
    expect(notation.format(0.001, 0)).toBe("1₋₃00");	/// FIXME Is this one right? Should be 1₋₃
    expect(notation.format(0.0001, 0)).toBe("100₋₆");
    expect(notation.format(0.00001, 0)).toBe("10₋₆0");	/// FIXME Is this one right? Should be 10₋₆
  });

  it("should format less than 1 to 2 places", () => {
    expect(notation.format(0.3, 2)).toBe("₀300₋₃");
    expect(notation.format(0.34, 2)).toBe("₀340₋₃");
    expect(notation.format(0.345, 2)).toBe("₀345₋₃");
    expect(notation.format(0.3456, 2)).toBe("₀346₋₃");
    expect(notation.format(0.003, 2)).toBe("3₋₃00");
    expect(notation.format(0.0034, 2)).toBe("3₋₃40");
    expect(notation.format(0.00345, 2)).toBe("3₋₃45");
    expect(notation.format(0.003456, 2)).toBe("3₋₃46");
  });

  it("should format more than 1e40 to 0 places", () => {
    expect(notation.format(3.45e40, 0)).toBe("34₃₉5");
    expect(notation.format(34.5e40, 0)).toBe("345₃₉");
    expect(notation.format(345e40, 0)).toBe("3₄₂45");
  });
});
