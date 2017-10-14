export interface Serie<T = Date> {
  name: string
  data: Point<T>[]
  color: string
  fill?: string
}

export interface Point<T = Date> {
  x?: T
  y: number
  name?: string
}

export type SizeValue = string | number
