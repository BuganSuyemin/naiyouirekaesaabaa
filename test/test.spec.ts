import assert from "assert";
import {比べる} from '../src/hikaku.js';

describe("перевірка порівняння", function () {
	it("пипец", function () {
		assert.strictEqual(比べる(1, 2), 0);
	});
});
