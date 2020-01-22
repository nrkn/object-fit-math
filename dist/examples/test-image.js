"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("./util");
exports.testImageData = ({ width, height }) => {
    const imageData = new ImageData(width, height);
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const index = y * width + x;
            const destIndex = index * 4;
            const yValue = Math.floor((255 / height) * y);
            const xValue = Math.floor((255 / width) * x);
            imageData.data[destIndex] = xValue;
            imageData.data[destIndex + 1] = yValue;
            imageData.data[destIndex + 2] = yValue;
            imageData.data[destIndex + 3] = 255;
        }
    }
    return imageData;
};
exports.testCanvas = (size) => {
    const canvas = document.createElement('canvas');
    const { width, height } = size;
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d') || util_1.noContext();
    context.putImageData(exports.testImageData(size), 0, 0);
    return canvas;
};
//# sourceMappingURL=test-image.js.map