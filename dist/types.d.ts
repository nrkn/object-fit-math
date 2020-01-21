export declare type Point = {
    x: number;
    y: number;
};
export declare type Size = {
    width: number;
    height: number;
};
export declare type Rect = Point & Size;
export declare type FitMode = 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
