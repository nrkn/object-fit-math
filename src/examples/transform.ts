import { noElement } from './util'
import { testCanvas } from './test-image'
import { transformFittedPoint } from '..'
import { FitMode } from '../types'

const parentEl: HTMLElement = document.querySelector( '.parent' ) || noElement()
const preEl = document.querySelector( 'pre' ) || noElement()

const canvas = testCanvas( { width: 16, height: 16 } )

parentEl.appendChild( canvas )

canvas.addEventListener( 'click', e => {
  const { offsetX: x, offsetY: y } = e

  const canvasSize = canvas.getBoundingClientRect()
  const { objectFit, objectPosition } = getComputedStyle( canvas )
  const [ left, top ] = objectPosition.split( ' ' )

  const childPoint = transformFittedPoint(
    { x, y }, canvasSize, canvas, objectFit as FitMode, left, top
  )

  childPoint.x = Math.floor( childPoint.x )
  childPoint.y = Math.floor( childPoint.y )

  preEl.innerHTML = JSON.stringify( childPoint )
} )
