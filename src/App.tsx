import React, {
  useRef,
  useReducer,
  useEffect,
  MouseEvent,
  ReactNode,
  createContext,
  useContext,
} from 'react'
import styles from './App.module.css'

type ID = string

type Point = {
  x: number
  y: number
}

type Dimensions = {
  left: number
  top: number
  width: number
  height: number
}

type DropCallback = (stackId: ID, cardId: ID) => void

type Card = {
  id: string
  color: string
}

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

const translate = (p: Point) => `translate(${p.x}px, ${p.y}px)`

const inside = (p: Point, array: Array<{ stackId: ID } & Dimensions>) => {
  for (let i = 0; i < array.length; i++) {
    const d = array[i]
    if (
      p.x >= d.left &&
      p.x <= d.left + d.width &&
      p.y >= d.top &&
      p.y <= d.top + d.height
    ) {
      return d
    }
  }
}

const length = 7
const maxRgb = 255

const indexToColor = (i: number) => {
  const value = (maxRgb / length) * i
  return `rgb(${value / 2}, 0, ${value})`
}

type DragProps = {
  cardId: ID
  children: ReactNode
  onDrop: DropCallback
}

const Drag = ({ children, cardId, onDrop }: DragProps) => {
  const draggable = useContext(DragContext)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let pressed = false
    let pressPoint = { x: 0, y: 0 }
    let position = { x: 0, y: 0 }

    const callbacks = [
      {
        key: 'mousedown',
        fn: (event: MouseEvent<HTMLElement>) => {
          if ((event.target as HTMLElement).parentNode !== ref.current) {
            return
          }
          console.log('down')
          pressed = true
          ref.current!.style.cursor = 'grabbing'
          pressPoint = { x: event.pageX, y: event.pageY }
        },
      },
      {
        key: 'mouseup',
        fn: (event: MouseEvent<HTMLElement>) => {
          if (!pressed) return
          console.log('up')
          pressed = false
          ref.current!.animate(
            [
              { transform: translate(position) },
              { transform: translate({ x: 0, y: 0 }) },
            ],
            {
              duration: 250,
              easing: 'cubic-bezier(0.2, 1, 0.1, 1)',
            }
          )
          ref.current!.style.cursor = 'grab'
          ref.current!.style.transform = translate({ x: 0, y: 0 })
          pressPoint = { x: 0, y: 0 }
          position = { x: 0, y: 0 }

          const isInside = inside({ x: event.pageX, y: event.pageY }, draggable)
          if (isInside) onDrop(isInside.stackId, cardId)
        },
      },
      {
        key: 'mousemove',
        fn: (event: MouseEvent<HTMLElement>) => {
          if (!pressed) return
          position = {
            x: event.pageX - pressPoint.x,
            y: event.pageY - pressPoint.y,
          }
          ref.current!.style.transform = translate(position)
        },
      },
    ]

    callbacks.forEach(callback => {
      // @ts-ignore
      window.addEventListener(callback.key, callback.fn)
    })
    return () => {
      callbacks.forEach(callback => {
        // @ts-ignore
        window.removeEventListener(callback.key, callback.fn)
      })
    }
  }, [draggable])

  return (
    <div style={{ cursor: 'grab' }} ref={ref}>
      {children}
    </div>
  )
}

const defaultContext: any = []

const DragContext = createContext<Array<{ stackId: ID } & Dimensions>>(
  defaultContext
)

type DropProps = {
  stackId: ID
}

const Drop = ({ stackId }: DropProps) => {
  const draggable = useContext(DragContext)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const { left, top, width, height } = ref.current!.getBoundingClientRect()
    draggable.push({ stackId, left, top, width, height })
  })

  return <div className={styles.drop} ref={ref} />
}

const Slot = () => <div className={styles.slot} />

type StackProps = {
  id: ID
  cards: Array<Card>
  onDrop: DropCallback
}

const Stack = ({ id, cards, onDrop }: StackProps) => {
  if (cards.length === 0) return <Drop stackId={id} />
  const [card, ...rest] = cards

  return (
    <Drag cardId={card.id} onDrop={onDrop}>
      <Box color={card.color} />
      <Stack id={id} cards={rest} onDrop={onDrop} />
    </Drag>
  )
}

const oneOf = (array: Array<any>) =>
  array[Math.round(Math.random() * (array.length - 1))]

const friends = ['bro', 'pal', 'mate', 'fella', 'buddy', 'dude']

const split = function<T>(predicate: (element: T) => boolean, array: Array<T>) {
  const index = array.findIndex(predicate, array)
  if (index === -1) {
    throw new Error(`Not present in ${array}`)
  }
  return [array.slice(0, index), array.slice(index)]
}

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

const colors = [...Array(length)].map((_, index) => index).map(indexToColor)

let id = 0
const makeCard = (color: string) => {
  id = id + 1
  return { id: `${id}`, color }
}

const initial: State = {
  stacks: [
    { id: '1', cards: [...colors].map(makeCard) },
    { id: '2', cards: [...colors].map(makeCard) },
  ],
}

export default () => {
  const droppables: any = defaultContext
  const [state, dispatch] = useReducer(reducer, { ...initial })

  const handleDrop = (stackId: ID, cardId: ID) =>
    dispatch({ type: 'drop', stackId, cardId })

  return (
    <div className={styles.app}>
      <DragContext.Provider value={droppables}>
        {state.stacks.map((stack, index) => (
          <div key={index} className={styles.stack} tabIndex={-1}>
            <Slot />
            <Stack id={stack.id} cards={stack.cards} onDrop={handleDrop} />
          </div>
        ))}
      </DragContext.Provider>
    </div>
  )
}
