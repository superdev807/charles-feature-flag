import { Disposable } from '@typed/disposable'
import { useEffect } from 'react'

export function useDisposable(fn: () => Disposable, deps?: ReadonlyArray<any>) {
  return useEffect(() => fn().dispose, deps)
}
