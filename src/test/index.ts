import * as fixtures from './fixtures.json'
import { fitAndPosition } from '..'
import { FitMode } from '../types'

for( let i = 0; i < fixtures.length; i++ ){
  const { job, expect } = fixtures[ i ]

  const { parent, child, fitMode, left, top } = job

  const result = fitAndPosition( parent, child, fitMode as FitMode, left, top )

  const pass = (
    result.x === expect.x &&
    result.y === expect.y &&
    result.width === expect.width &&
    result.height === expect.height
  )

  console.log( `${ pass ? 'pass' : 'fail' } ${ i + 1 }/${ fixtures.length }` )

  if( !pass ){
    console.log( `  Expected ${ JSON.stringify( expect ) } but result was ${ JSON.stringify( result ) } `)

    process.exit( 1 )
  }
}
