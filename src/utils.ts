import { ID, Point, Dimensions } from './types'

export const ANIMATION_TIME = 250

export const translate = (p: Point) => `translate(${p.x}px, ${p.y}px)`

export const inside = (p: Point, d: Dimensions) =>
  p.x >= d.left &&
  p.x <= d.left + d.width &&
  p.y >= d.top &&
  p.y <= d.top + d.height

export const insideOneOf = (
  p: Point,
  array: Array<{ stackId: ID } & Dimensions>
) => {
  for (let i = 0; i < array.length; i++) {
    if (inside(p, array[i])) return array[i]
  }
}

export const animate = (from: Point, to: Point, options: any) => [
  [{ transform: translate(from) }, { transform: translate(to) }],
  {
    duration: ANIMATION_TIME,
    easing: 'cubic-bezier(0.2, 1, 0.1, 1)',
    ...options,
  },
]

export const oneOf = (array: Array<any>) =>
  array[Math.round(Math.random() * (array.length - 1))]

export const friends = ['bro', 'pal', 'mate', 'fella', 'buddy', 'dude']

export const split = function<T>(
  predicate: (element: T) => boolean,
  array: Array<T>
) {
  const index = array.findIndex(predicate, array)
  if (index === -1) {
    throw new Error(`Not present in ${array}`)
  }
  return [array.slice(0, index), array.slice(index)]
}
