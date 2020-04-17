import { Maybe, Nothing } from '@typed/maybe'
import { useCallback, useState } from 'react'

export function useMaybe<A>(initial: Maybe<A> | (() => Maybe<A>) = Nothing) {
  const [maybe, setMaybe] = useState(initial)
  const clear = useCallback(() => setMaybe(Nothing), [maybe])
  const set = useCallback((value: A | null | undefined | void) => setMaybe(Maybe.of(value)), [
    maybe,
  ])

  return [maybe, set, clear] as const
}
