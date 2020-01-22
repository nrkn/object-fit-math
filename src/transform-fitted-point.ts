import { Point, Size, FitMode } from './types'
import { fitAndPosition } from './fitter'

export const transformFittedPoint = (
  fittedPoint: Point, parent: Size, child: Size,
  fitMode: FitMode = 'fill', left = '50%', top = '50%'
) => {
  const {
    x: positionedX,
    y: positionedY,
    width: fittedWidth,
    height: fittedHeight
  } = fitAndPosition( parent, child, fitMode, left, top )

  const wRatio = child.width / fittedWidth
  const hRatio = child.height / fittedHeight

  const x = ( fittedPoint.x - positionedX ) * wRatio
  const y = ( fittedPoint.y - positionedY ) * hRatio

  const childPoint: Point = { x, y }

  return childPoint
}
