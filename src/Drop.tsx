import React, { useContext, useRef, useEffect } from 'react'
import DragContext from './DragContext'
import { ID } from './types'
import styles from './styles.module.css'

type Props = {
  stackId: ID
}

const Drop = ({ stackId }: Props) => {
  const draggable = useContext(DragContext)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const { left, top, width, height } = ref.current!.getBoundingClientRect()
    draggable.push({ stackId, left, top, width, height })
  })

  return <div className={styles.drop} ref={ref} />
}

export default Drop
