"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("./util");
const test_image_1 = require("./test-image");
const __1 = require("..");
const parentEl = document.querySelector('.parent') || util_1.noElement();
const preEl = document.querySelector('pre') || util_1.noElement();
const canvas = test_image_1.testCanvas({ width: 16, height: 16 });
parentEl.appendChild(canvas);
canvas.addEventListener('click', e => {
    const { offsetX: x, offsetY: y } = e;
    const canvasSize = canvas.getBoundingClientRect();
    const { objectFit, objectPosition } = getComputedStyle(canvas);
    const [left, top] = objectPosition.split(' ');
    const childPoint = __1.transformFittedPoint({ x, y }, canvasSize, canvas, objectFit, left, top);
    childPoint.x = Math.floor(childPoint.x);
    childPoint.y = Math.floor(childPoint.y);
    preEl.innerHTML = JSON.stringify(childPoint);
});
//# sourceMappingURL=transform.js.map