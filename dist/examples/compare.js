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
//# sourceMappingURL=compare.js.map