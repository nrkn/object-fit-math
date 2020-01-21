import { Size, FitMode, Point, Rect } from './types'

export const fit = ( parent: Size, child: Size, fitMode: FitMode = 'fill' ) => {
  if ( fitMode === 'scale-down' ) {
    if ( child.width <= parent.width && child.height <= parent.height ) {
      fitMode = 'none'
    } else {
      fitMode = 'contain'
    }
  }

  if ( fitMode === 'cover' || fitMode === 'contain' ) {
    const wr = parent.width / child.width
    const hr = parent.height / child.height
    const ratio = fitMode === 'cover' ? Math.max( wr, hr ) : Math.min( wr, hr )

    const width = child.width * ratio
    const height = child.height * ratio
    const size: Size = { width, height }

    return size
  }

  if ( fitMode === 'none' ) return child

  // default case, fitMode === 'fill'
  return parent
}

export const position = (
  parent: Size, child: Size, left = '50%', top = '50%'
) => {
  const x = lengthToPixels( left, parent.width, child.width )
  const y = lengthToPixels( top, parent.height, child.height )

  const point: Point = { x, y }

  return point
}

export const fitAndPosition = (
  parent: Size, child: Size,
  fitMode: FitMode = 'fill', left = '50%', top = '50%'
) => {
  const fitted = fit( parent, child, fitMode )

  const { x, y } = position( parent, fitted, left, top )
  const { width, height } = fitted

  const rect: Rect = { x, y, width, height }

  return rect
}

const lengthToPixels = ( length: string, parent: number, child: number ) =>
  length.endsWith( '%' ) ?
    ( parent - child ) * ( parseFloat( length ) / 100 ) :
    parseFloat( length )
