(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const data_1 = require("./data");
const fitter_1 = require("../fitter");
const test_image_data_1 = require("./test-image-data");
const fixtures = [];
const noElement = () => {
    throw Error('Expected querySelector to find an element');
};
const fixturesEl = document.querySelector('pre') || noElement();
const templateEl = document.querySelector('template') || noElement();
const imageDataCache = new Map();
const createCanvas = (size) => {
    const canvas = document.createElement('canvas');
    canvas.width = size.width;
    canvas.height = size.height;
    const context = canvas.getContext('2d');
    if (!context)
        throw Error('Expected 2d drawing context');
    const key = `${size.width} ${size.height}`;
    let imageData = imageDataCache.get(key);
    if (!imageData) {
        imageData = test_image_data_1.testImageData(canvas);
        imageDataCache.set(key, imageData);
    }
    context.putImageData(imageData, 0, 0);
    return canvas;
};
const createCompare = (job) => {
    const { parent, child, fitMode, left, top } = job;
    const data = `
parent:          ${parent.width} ✕ ${parent.height}
child:           ${child.width} ✕ ${child.height}
object-fit:      ${fitMode}
object-position: ${left} ${top}
  `.trim();
    const el = templateEl.content.cloneNode(true);
    const pre = el.querySelector('pre') || noElement();
    const dom = el.querySelector('.dom') || noElement();
    const math = el.querySelector('.math') || noElement();
    const domParent = dom.querySelector('.parent') || noElement();
    const domChild = createCanvas(child);
    const mathParent = math.querySelector('.parent') || noElement();
    const mathChild = createCanvas(child);
    const expect = fitter_1.fitAndPosition(parent, child, fitMode, left, top);
    const fixture = { job, expect };
    fixtures.push(fixture);
    const { x, y, width, height } = expect;
    domParent.style.width = `${parent.width}px`;
    domParent.style.height = `${parent.height}px`;
    domChild.style.objectFit = fitMode;
    domChild.style.objectPosition = `${left} ${top}`;
    mathParent.style.width = `${parent.width}px`;
    mathParent.style.height = `${parent.height}px`;
    mathChild.style.width = `${width}px`;
    mathChild.style.height = `${height}px`;
    mathChild.style.left = `${x}px`;
    mathChild.style.top = `${y}px`;
    domChild.classList.add('child');
    domParent.appendChild(domChild);
    mathChild.classList.add('child');
    mathParent.appendChild(mathChild);
    pre.innerHTML = data;
    return el;
};
const sizesReverse = data_1.sizes.slice().reverse();
const labelEl = document.querySelector('label') || noElement();
const progressEl = labelEl.querySelector('progress') || noElement();
const expectCount = (data_1.lengths.length * data_1.lengths.length * data_1.fitModes.length * data_1.sizes.length *
    data_1.sizes.length);
progressEl.max = expectCount;
const fragment = document.createDocumentFragment();
const jobs = [];
data_1.lengths.forEach(left => {
    data_1.lengths.forEach(top => {
        data_1.fitModes.forEach(fitMode => {
            data_1.sizes.forEach(parentSize => {
                sizesReverse.forEach(childSize => {
                    jobs.push({ parent: parentSize, child: childSize, fitMode, left, top });
                });
            });
        });
    });
});
jobs.reverse();
const batchSize = 10;
const tick = (onComplete) => {
    for (let i = 0; i < batchSize; i++) {
        if (!jobs.length) {
            onComplete();
            return;
        }
        const job = jobs.pop();
        const el = createCompare(job);
        fragment.appendChild(el);
        progressEl.value++;
    }
    setTimeout(() => tick(onComplete), 0);
};
const onComplete = () => {
    document.body.appendChild(fragment);
    labelEl.remove();
    document.body.appendChild(fixturesEl);
    fixturesEl.innerHTML = JSON.stringify(fixtures, null, 2);
};
tick(onComplete);

},{"../fitter":4,"./data":2,"./test-image-data":3}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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

},{}]},{},[1]);
