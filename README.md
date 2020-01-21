# object-fit-math

Just the math behind object-fit and object-position

It has no dependencies and just exposes a few simple functions

Allows you to use the same math as the browser uses for `object-fit` and
`object-position`

Supports the following `object-fit` properties:

`contain`, `cover`, `fill`, `none`, `scale-down`

Supports `object-position` specified in `px` or `%` only

Use cases:

- using the same algorithm as the browser elsewhere, like on an HTML canvas
  or server side image rendering
- finding out the bounds for an object that's using `object-fit` and
  `object-position` - this is what I actually wrote this for, so I could
  translate the mouse/touch event locations to the actual pixel location on a
  fitted `img`/`canvas`/`video` element
- you could use it to make a polyfill I guess

## usage

`npm install object-fit-math`

### basic usage

```js
const { fit, position, fitAndPosition } = require( 'object-fit-math' )

const parentSize = { width: 320, height: 240 }
const childSize = { width: 90, height: 160 }

const fitted = fit( parentSize, childSize, 'contain' )

// { width: 135, height: 240 }
console.log( fitted )

const positioned = position( parentSize, fitted, '50%', '50%' )

// { x: 92.5, y: 0 }
console.log( positioned )

const rect = fitAndPosition( parentSize, childSize, 'contain', '50%', '50%' )

// { x: 92.5, y: 0, width: 135, height: 240 }
console.log( rect )
```

### translate a point on the fitted element to original pixel location

```js
const { transformFittedPoint } = require( 'object-fit-math' )

// get the object eg a canvas that uses object-fit from the DOM here

canvas.addEventListener( 'click', e => {
  const { offsetX: x, offsetY: y } = e

  const canvasSize = canvas.getBoundingClientRect()
  const { objectFit, objectPosition } = getComputedStyle( canvas )
  const [ left, top ] = objectPosition.split( ' ' )

  const childPoint = transformFittedPoint(
    { x, y }, canvasSize, canvas, objectFit, left, top
  )}

  console.log( childPoint )
}
```

## license

MIT License

Copyright (c) 2020 Nik Coughlin

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
