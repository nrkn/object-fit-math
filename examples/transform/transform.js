(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"./util":3}],2:[function(require,module,exports){
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

},{"..":5,"./test-image":1,"./util":3}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.noElement = () => {
    throw Error('Expected querySelector to find an element');
};
exports.noContext = () => {
    throw Error('Expected 2d drawing context');
};

},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fit = (parent, child, fitMode = 'fill') => {
    if (fitMode === 'scale-down') {
        if (child.width <= parent.width && child.height <= parent.height) {
            fitMode = 'none';
        }
        else {
            fitMode = 'contain';
        }
    }
    if (fitMode === 'cover' || fitMode === 'contain') {
        const wr = parent.width / child.width;
        const hr = parent.height / child.height;
        const ratio = fitMode === 'cover' ? Math.max(wr, hr) : Math.min(wr, hr);
        const width = child.width * ratio;
        const height = child.height * ratio;
        const size = { width, height };
        return size;
    }
    if (fitMode === 'none')
        return child;
    // default case, fitMode === 'fill'
    return parent;
};
exports.position = (parent, child, left = '50%', top = '50%') => {
    const x = lengthToPixels(left, parent.width, child.width);
    const y = lengthToPixels(top, parent.height, child.height);
    const point = { x, y };
    return point;
};
exports.fitAndPosition = (parent, child, fitMode = 'fill', left = '50%', top = '50%') => {
    const fitted = exports.fit(parent, child, fitMode);
    const { x, y } = exports.position(parent, fitted, left, top);
    const { width, height } = fitted;
    const rect = { x, y, width, height };
    return rect;
};
const lengthToPixels = (length, parent, child) => length.endsWith('%') ?
    (parent - child) * (parseFloat(length) / 100) :
    parseFloat(length);

},{}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fitter_1 = require("./fitter");
exports.fit = fitter_1.fit;
exports.position = fitter_1.position;
exports.fitAndPosition = fitter_1.fitAndPosition;
var transform_fitted_point_1 = require("./transform-fitted-point");
exports.transformFittedPoint = transform_fitted_point_1.transformFittedPoint;
var predicates_1 = require("./predicates");
exports.isFit = predicates_1.isFit;

},{"./fitter":4,"./predicates":6,"./transform-fitted-point":7}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fitModes = {
    contain: true,
    cover: true,
    fill: true,
    none: true,
    'scale-down': true
};
exports.isFit = (value) => value in fitModes;

},{}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fitter_1 = require("./fitter");
exports.transformFittedPoint = (fittedPoint, parent, child, fitMode = 'fill', left = '50%', top = '50%') => {
    const { x: positionedX, y: positionedY, width: fittedWidth, height: fittedHeight } = fitter_1.fitAndPosition(parent, child, fitMode, left, top);
    const wRatio = child.width / fittedWidth;
    const hRatio = child.height / fittedHeight;
    const x = (fittedPoint.x - positionedX) * wRatio;
    const y = (fittedPoint.y - positionedY) * hRatio;
    const childPoint = { x, y };
    return childPoint;
};

},{"./fitter":4}]},{},[2]);
