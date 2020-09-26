// import { StandardNotation } from '../../dist/ad-notations.esm.js';
const { StandardNotation } = require('../../dist/ad-notations.umd.js');

describe("Standard notation", function() {

	const notation = new StandardNotation();

	it(" less than 1000, 0 places", function() {
		expect(notation.format(3, 0, 0)).toBe("3");
		expect(notation.format(34, 0, 0)).toBe("34");
		expect(notation.format(345, 0, 0)).toBe("345");
	});
	it(" more than 1e40, 0 places", function() {
		expect(notation.format(3.45e40, 0)).toBe("35 DDc");
		expect(notation.format(34.5e40, 0)).toBe("345 DDc");
		expect(notation.format(345e40, 0)).toBe("3 TDc");
	});
	it(" more than 1e40, 4 places", function() {
		expect(notation.format(3.4567e40, 0)).toBe("35 DDc");
		expect(notation.format(34.567e40, 0)).toBe("346 DDc");
		expect(notation.format(345.67e40, 0)).toBe("3 TDc");
		expect(notation.format(3456.7e40, 0)).toBe("35 TDc");
	});
});
