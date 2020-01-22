"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fixtures = require("./fixtures.json");
const __1 = require("..");
for (let i = 0; i < fixtures.length; i++) {
    const { job, expect } = fixtures[i];
    const { parent, child, fitMode, left, top } = job;
    const result = __1.fitAndPosition(parent, child, fitMode, left, top);
    const pass = (result.x === expect.x &&
        result.y === expect.y &&
        result.width === expect.width &&
        result.height === expect.height);
    console.log(`${pass ? 'pass' : 'fail'} ${i + 1}/${fixtures.length}`);
    if (!pass) {
        console.log(`  Expected ${JSON.stringify(expect)} but result was ${JSON.stringify(result)} `);
        process.exit(1);
    }
}
//# sourceMappingURL=index.js.map