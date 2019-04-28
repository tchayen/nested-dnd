import React, { ReactNode } from 'react'
import { ID, Card, DropCallback } from './types'
import Drag from './Drag'
import Drop from './Drop'

type Props = {
  id: ID
  cards: Array<Card>
  onDrop: DropCallback
  render: (card: Card) => ReactNode
  verticalOffset: number
  elementHeight: number
}

const Stack = ({
  id,
  cards,
  onDrop,
  render,
  elementHeight,
  verticalOffset,
}: Props) => {
  if (cards.length === 0) return <Drop stackId={id} />
  const [card, ...rest] = cards
  return (
    <Drag
      cardId={card.id}
      onDrop={onDrop}
      elementHeight={elementHeight}
      verticalOffset={verticalOffset}
    >
      {render(card)}
      <Stack
        id={id}
        cards={rest}
        onDrop={onDrop}
        render={render}
        elementHeight={elementHeight}
        verticalOffset={verticalOffset}
      />
    </Drag>
  )
}

export default Stack
