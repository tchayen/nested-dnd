import React, {
  useState,
  useRef,
  useEffect,
  MouseEvent,
  ReactNode,
} from 'react'
import styles from './App.module.css'

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

type BoxProps = {
  color: string
}

const Box = ({ color }: BoxProps) => (
  <div
    className={styles.box}
    style={{
      backgroundColor: color,
    }}
  />
)

const translate = (p: Point) => `translate(${p.x}px, ${p.y}px)`

const inside = (p: Point, array: Array<Dimensions>) =>
  array.some(
    d =>
      p.x >= d.left &&
      p.x <= d.left + d.width &&
      p.y >= d.top &&
      p.y <= d.top + d.height
  )

const length = 6
const maxRgb = 255

const indexToColor = (i: number) => {
  const value = (maxRgb / length) * i
  return `rgb(${value}, 0, ${value})`
}

type DragProps = {
  children: ReactNode
  idn: number
}

const Drag = ({ children, idn }: DragProps) => {
  const ref = useRef<HTMLDivElement>(null)
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
        console.log(`${idn}: down`)
        pressed = true
        ref.current!.style.cursor = 'grabbing'
        pressPoint = { x: event.pageX, y: event.pageY }
      },
    },
    {
      key: 'mouseup',
      fn: (event: MouseEvent<HTMLElement>) => {
        if (!pressed) return
        console.log(`${idn}: up`)
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

        console.log(inside({ x: event.pageX, y: event.pageY }, []))
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

  useEffect(() => {
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
  }, [])

  return (
    <div style={{ cursor: 'grab' }} ref={ref}>
      {children}
    </div>
  )
}

const Drop = () => <div style={{ width: '100%', height: '100%' }}>drop!</div>

const Slot = () => <div className={styles.slot} />

const Stack = ({ colors }: any) => {
  if (colors.length === 0) return <Drop />
  const [color, ...rest] = colors

  return (
    <Drag idn={0}>
      <Box color={color} />
      <Stack colors={rest} />
    </Drag>
  )
}

export default () => {
  const colors = [...Array(length)].map((_, index) => index).map(indexToColor)

  return (
    <div className={styles.app}>
      <div tabIndex={-1} style={{ position: 'absolute', left: 0, top: 0 }}>
        <Slot />
        <Stack colors={colors} offset={0} />
      </div>
      <div tabIndex={-1} style={{ position: 'absolute', left: 200, top: 0 }}>
        <Slot />
        <Stack colors={colors} offset={0} />
      </div>
    </div>
  )
}
