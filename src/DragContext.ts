import { createContext } from 'react'
import { ID, Dimensions } from './types'

export const defaultContext: any = []

const DragContext = createContext<Array<{ stackId: ID } & Dimensions>>(
  defaultContext
)

export default DragContext
