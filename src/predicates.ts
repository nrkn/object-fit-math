import { FitMode } from './types'

const fitModes = {
  contain: true,
  cover: true,
  fill: true,
  none: true,
  'scale-down': true
}

export const isFit = ( value: any ): value is FitMode => value in fitModes
