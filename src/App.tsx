import React, { useReducer } from 'react'
import { ID, Card, Dimensions } from './types'
import styles from './styles.module.css'
import Stack from './Stack'
import { split, oneOf, friends } from './utils'
import DragContext, { defaultContext } from './DragContext'

type CardStack = {
  id: ID
  cards: Array<Card>
}

type State = {
  stacks: Array<CardStack>
}

type Action = { type: 'drop'; stackId: ID; cardId: ID }

type BoxProps = {
  color: string
}

const Box = ({ color }: BoxProps) => (
  <div className={styles.box} style={{ backgroundColor: color }} />
)

const length = 7
const maxRgb = 255

const indexToPink = (i: number) => {
  const value = (maxRgb / length) * (i + 3) * 2
  return `rgb(${value / 2}, 0, ${value})`
}

const indexToOrange = (i: number) => {
  const value = (maxRgb / length) * (i + 3) * 2
  return `rgb(${value}, ${value / 2}, 0)`
}

const indexToBlue = (i: number) => {
  const value = (maxRgb / length) * (i + 3) * 2
  return `rgb(0, ${value / 2}, ${value})`
}

const Slot = () => <div className={styles.slot} />

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'drop':
      let replaceId: any = -1
      let replace: any = undefined
      let moveId = state.stacks.findIndex(stack => stack.id === action.stackId)
      let move: any = undefined

      state.stacks.forEach((stack, id) => {
        if (stack.cards.findIndex(card => card.id === action.cardId) !== -1) {
          const [stays, moves] = split(
            card => card.id === action.cardId,
            stack.cards
          )

          move = moves
          replace = stays
          replaceId = id
        }
      })

      state.stacks[replaceId].cards = replace
      state.stacks[moveId].cards = [...state.stacks[moveId].cards, ...move]

      return { ...state }
    default:
      throw new Error(`Unrecognized action type, ${oneOf(friends)}`)
  }
}

const colors = [...Array(length)].map((_, index) => index)

let id = 0
const makeCard = (color: string) => {
  id = id + 1
  return { id: `${id}`, color }
}

const initial: State = {
  stacks: [
    {
      id: '1',
      cards: [...colors.map(indexToPink).slice(0, 5)].map(makeCard),
    },
    {
      id: '2',
      cards: [...colors.map(indexToOrange).slice(0, 4)].map(makeCard),
    },
    {
      id: '3',
      cards: [...colors.map(indexToBlue).slice(0, 3)].map(makeCard),
    },
  ],
}

export default () => {
  // It's important to use spread here so the context will be recreated on each
  // render. That way there is no need to change droppables, since every change
  // to them will happen only during rerender reaching *this* code.
  const droppables: Array<{ stackId: string } & Dimensions> = [
    ...defaultContext,
  ]

  const [state, dispatch] = useReducer(reducer, { ...initial })

  const handleDrop = (stackId: ID, cardId: ID) =>
    dispatch({ type: 'drop', stackId, cardId })

  return (
    <div className={styles.app}>
      <DragContext.Provider value={droppables}>
        {state.stacks.map((stack, index) => (
          <div key={index} className={styles.stack} tabIndex={-1}>
            <Slot />
            <Stack
              id={stack.id}
              cards={stack.cards}
              onDrop={handleDrop}
              render={(card: Card) => <Box color={card.color} />}
            />
          </div>
        ))}
      </DragContext.Provider>
    </div>
  )
}
