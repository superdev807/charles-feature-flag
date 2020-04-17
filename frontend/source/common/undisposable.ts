import { Disposable } from '@typed/disposable'

export function undisposable<A extends readonly any[]>(fn: (...args: A) => void) {
  return (...args: A): Disposable => {
    fn(...args)

    return Disposable.None
  }
}
