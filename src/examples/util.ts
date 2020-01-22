export const noElement = () => {
  throw Error( 'Expected querySelector to find an element' )
}

export const noContext = () => {
  throw Error( 'Expected 2d drawing context' )
}