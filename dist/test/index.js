"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fixtures = require("./fixtures.json");
const fitter_js_1 = require("../fitter.js");
for (let i = 0; i < fixtures.length; i++) {
    const { job, expect } = fixtures[i];
    const { parent, child, fitMode, left, top } = job;
    const result = fitter_js_1.fitAndPosition(parent, child, fitMode, left, top);
    const pass = (result.x === expect.x &&
        result.y === expect.y &&
        result.width === expect.width &&
        result.height === expect.height);
    console.log(`${pass ? 'pass' : 'fail'} ${i + 1}/${fixtures.length}`);
    if (!pass) {
        console.log(`  Expected ${JSON.stringify(expect)} but result was ${JSON.stringify(result)} `);
        break;
    }
}
//# sourceMappingURL=index.js.map