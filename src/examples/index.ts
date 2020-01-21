import { Size, FitMode, Rect } from '../types'
import { fitModes, sizes, lengths } from './data'
import { fitAndPosition } from '../fitter'

interface Job {
  parent: Size
  child: Size
  fitMode: FitMode
  left: string
  top: string
}

interface Fixture {
  job: Job
  expect: Rect
}

const fixtures: Fixture[] = []

const noElement = () => {
  throw Error( 'Expected querySelector to find an element' )
}

const fixturesEl = document.querySelector( 'pre' ) || noElement()

const templateEl = document.querySelector( 'template' ) || noElement()

const imageDataCache = new Map<string,ImageData>()

const createCanvas = ( size: Size ) => {
  const canvas = document.createElement( 'canvas' )

  canvas.width = size.width
  canvas.height = size.height

  const context = canvas.getContext( '2d' )

  if ( !context ) throw Error( 'Expected 2d drawing context' )

  const key = `${ size.width } ${ size.height }`

  let imageData = imageDataCache.get( key )

  if( !imageData ){
    imageData = new ImageData( canvas.width, canvas.height )

    for ( let y = 0; y < canvas.height; y++ ) {
      for ( let x = 0; x < canvas.width; x++ ) {
        const index = y * canvas.width + x
        const destIndex = index * 4

        const yValue = Math.floor( ( 255 / canvas.height ) * y )
        const xValue = Math.floor( ( 255 / canvas.width ) * x )

        imageData.data[ destIndex ] = xValue
        imageData.data[ destIndex + 1 ] = yValue
        imageData.data[ destIndex + 2 ] = yValue
        imageData.data[ destIndex + 3 ] = 255
      }
    }

    imageDataCache.set( key, imageData )
  }

  context.putImageData( imageData, 0, 0 )

  return canvas
}

const createCompare = (
  job: Job
) => {
  const { parent, child, fitMode, left, top } = job

  const data = `
parent:          ${ parent.width } ✕ ${ parent.height }
child:           ${ child.width } ✕ ${ child.height }
object-fit:      ${ fitMode }
object-position: ${ left } ${ top }
  `.trim()

  const el = templateEl.content.cloneNode( true ) as DocumentFragment

  const pre = el.querySelector( 'pre' ) || noElement()
  const dom = el.querySelector( '.dom' ) || noElement()
  const math = el.querySelector( '.math' ) || noElement()
  const domParent: HTMLElement = dom.querySelector( '.parent' ) || noElement()
  const domChild = createCanvas( child )
  const mathParent: HTMLElement = math.querySelector( '.parent' ) || noElement()
  const mathChild = createCanvas( child )

  const expect = fitAndPosition(
    parent, child, fitMode, left, top
  )

  const fixture: Fixture = { job, expect }

  fixtures.push( fixture )

  const { x, y, width, height } = expect

  domParent.style.width = `${ parent.width }px`
  domParent.style.height = `${ parent.height }px`

  domChild.style.objectFit = fitMode
  domChild.style.objectPosition = `${ left } ${ top }`

  mathParent.style.width = `${ parent.width }px`
  mathParent.style.height = `${ parent.height }px`

  mathChild.style.width = `${ width }px`
  mathChild.style.height = `${ height }px`
  mathChild.style.left = `${ x }px`
  mathChild.style.top = `${ y }px`

  domChild.classList.add( 'child' )
  domParent.appendChild( domChild )

  mathChild.classList.add( 'child' )
  mathParent.appendChild( mathChild )

  pre.innerHTML = data

  return el
}

const sizesReverse = sizes.slice().reverse()

const labelEl = document.querySelector( 'label' ) || noElement()
const progressEl = labelEl.querySelector( 'progress' ) || noElement()

const expectCount = (
  lengths.length * lengths.length * fitModes.length * sizes.length *
  sizes.length
)

progressEl.max = expectCount

const fragment = document.createDocumentFragment()

const jobs: Job[] = []

lengths.forEach( left => {
  lengths.forEach( top => {
    fitModes.forEach( fitMode => {
      sizes.forEach( parentSize => {
        sizesReverse.forEach( childSize => {
          jobs.push( { parent: parentSize, child: childSize, fitMode, left, top } )
        } )
      } )
    } )
  } )
} )

jobs.reverse()

const batchSize = 10

type OnComplete = () => void

const tick = ( onComplete: OnComplete ) => {
  for( let i = 0; i < batchSize; i++ ){
    if ( !jobs.length ) {
      onComplete()

      return
    }

    const job = jobs.pop()!
    const el = createCompare( job )

    fragment.appendChild( el )

    progressEl.value++
  }

  setTimeout( () => tick( onComplete ), 0 )
}

const onComplete = () => {
  document.body.appendChild( fragment )
  labelEl.remove()

  document.body.appendChild( fixturesEl )
  fixturesEl.innerHTML = JSON.stringify( fixtures, null, 2 )
}

tick( onComplete )
