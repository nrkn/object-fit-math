import { Size, FitMode } from '../types'

// larger parent, smaller child
// landscape, portrait
// pixel left/top, percent left/top

export const fitModes: FitMode[] = [
  'contain', 'cover', 'fill', 'none', 'scale-down'
]

export const sizes: Size[] = [
  { width: 320, height: 240 },
  { width: 240, height: 320 },
  { width: 160, height: 90 },
  { width: 90, height: 160 }
]

export const percents = [ '50%', '0%', '100%' ]

export const pixels = [ '0px', '40px', '80px' ]

export const lengths = [ ...percents, ...pixels ]
