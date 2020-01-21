import { Size, FitMode, Point, Rect } from './types';
export declare const fit: (parent: Size, child: Size, fitMode?: FitMode) => Size;
export declare const position: (parent: Size, child: Size, left?: string, top?: string) => Point;
export declare const fitAndPosition: (parent: Size, child: Size, fitMode?: FitMode, left?: string, top?: string) => Rect;
