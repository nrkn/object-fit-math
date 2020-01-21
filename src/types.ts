export type Point = { x: number, y: number }

export type Size = { width: number, height: number }

export type Rect = Point & Size

export type FitMode = 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'
