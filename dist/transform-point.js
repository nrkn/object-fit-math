"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fitter_1 = require("./fitter");
exports.parentPointToChildPoint = (parentPoint, parent, child, objectFit = 'fill', left = '50%', top = '50%') => {
    const { x: positionedX, y: positionedY, width: fittedWidth, height: fittedHeight } = fitter_1.fitAndPosition(parent, child, objectFit, left, top);
    const wRatio = child.width / fittedWidth;
    const hRatio = child.height / fittedHeight;
    const x = (parentPoint.x - positionedX) * wRatio;
    const y = (parentPoint.y - positionedY) * hRatio;
    const childPoint = { x, y };
    return childPoint;
};
//# sourceMappingURL=transform-point.js.map