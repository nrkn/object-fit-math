"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// larger parent, smaller child
// landscape, portrait
// pixel left/top, percent left/top
exports.fitModes = [
    'contain', 'cover', 'fill', 'none', 'scale-down'
];
exports.sizes = [
    { width: 320, height: 240 },
    { width: 240, height: 320 },
    { width: 160, height: 90 },
    { width: 90, height: 160 }
];
exports.percents = ['50%', '0%', '100%'];
exports.pixels = ['0px', '40px', '80px'];
exports.lengths = [...exports.percents, ...exports.pixels];
//# sourceMappingURL=data.js.map