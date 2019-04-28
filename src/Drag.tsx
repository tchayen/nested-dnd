import React, {
  ReactNode,
  useContext,
  useRef,
  useEffect,
  MouseEvent,
} from 'react'
import DragContext from './DragContext'
import { ID, DropCallback } from './types'
import { ANIMATION_TIME, insideOneOf, translate, animate } from './utils'

type Props = {
  cardId: ID
  children: ReactNode
  onDrop: DropCallback
  elementHeight: number
  verticalOffset: number
}

const Drag = ({
  children,
  cardId,
  onDrop,
  elementHeight,
  verticalOffset,
}: Props) => {
  const draggable = useContext(DragContext)
  const ref = useRef<HTMLDivElement>(null)
  const offsetFromBottom = elementHeight - verticalOffset

  useEffect(() => {
    let pressed = false
    let pressPoint = { x: 0, y: -offsetFromBottom }
    let position = { x: 0, y: -offsetFromBottom }

    const callbacks = [
      {
        key: 'mousedown',
        fn: (event: MouseEvent<HTMLElement>) => {
          if ((event.target as HTMLElement).parentNode !== ref.current) {
            return
          }
          pressed = true
          ref.current!.style.cursor = 'grabbing'
          pressPoint = { x: event.pageX, y: event.pageY }
        },
      },
      {
        key: 'mouseup',
        fn: (event: MouseEvent<HTMLElement>) => {
          if (!pressed) return
          pressed = false
          const dropPoint = { x: event.pageX, y: event.pageY }
          const { left, top, height } = ref.current!.getBoundingClientRect()
          const isInside = insideOneOf(dropPoint, draggable)

          const animateBack = () => {
            ref.current!.animate(
              // @ts-ignore
              ...animate(position, { x: 0, y: -offsetFromBottom })
            )
            ref.current!.style.cursor = 'grab'
            ref.current!.style.transform = translate({
              x: 0,
              y: -offsetFromBottom,
            })
            pressPoint = { x: 0, y: -offsetFromBottom }
            position = { x: 0, y: -offsetFromBottom }
          }

          if (isInside) {
            const end = {
              x: position.x + isInside.left - left,
              y: position.y + isInside.top - top + verticalOffset,
            }

            // Hacky way to check if the drop target is the same stack it was
            // in or not.
            if (!(end.x === 0 && end.y < 0 && end.y > -elementHeight)) {
              ref.current!.animate(
                // @ts-ignore
                ...animate(position, end, { fill: 'forwards' })
              )
              setTimeout(() => onDrop(isInside.stackId, cardId), ANIMATION_TIME)
            } else {
              animateBack()
            }
          } else {
            animateBack()
          }
        },
      },
      {
        key: 'mousemove',
        fn: (event: MouseEvent<HTMLElement>) => {
          if (!pressed) return
          position = {
            x: event.pageX - pressPoint.x,
            y: event.pageY - pressPoint.y - offsetFromBottom,
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
  }, [draggable, cardId, onDrop])

  return (
    <div
      style={{
        cursor: 'grab',
        transform: `translate(0, -${offsetFromBottom}px)`,
      }}
      ref={ref}
    >
      {children}
    </div>
  )
}

export default Drag
