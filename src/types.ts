export type ID = string

export type DropCallback = (stackId: ID, cardId: ID) => void

export type Dimensions = {
  left: number
  top: number
  width: number
  height: number
}

export type Point = {
  x: number
  y: number
}

export type Card = {
  id: string
  color: string
}
