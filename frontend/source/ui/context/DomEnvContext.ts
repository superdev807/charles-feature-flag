import { Disposable } from '@typed/disposable'
import { DomEnv } from '@typed/dom'
import { HistoryEnv, wrapInSubscription } from '@typed/history'
import { useEffect, useMemo, useState } from 'react'
import { domEnv } from '../../common/domEnv'
import { useDisposable } from '../hooks/useDisposable'
import { createContextFromHook } from './createContextFromHook'

export const [DomEnvProvider, useDomEnv, DomEnvContext] = createContextFromHook(
  __useDomEnv,
  'DomEnv',
  domEnv,
)

function __useDomEnv<A = null>(initialDomEnv: DomEnv<A>): DomEnv<A> {
  const [domEnv, setDomEnv] = useState(() => addSub(initialDomEnv))
  const updateHistory = useMemo(
    () => (historyEnv: HistoryEnv<A>) => setDomEnv({ ...domEnv, ...historyEnv }),
    [domEnv],
  )
  const { window, subscription } = domEnv

  useDisposable(
    () => subscription.subscribe(historyEnv => (updateHistory(historyEnv), Disposable.None)),
    [subscription],
  )
  useEffect(() => (window.onpopstate = () => setDomEnv({ ...domEnv })), [])

  return domEnv
}

function addSub<A>(domEnv: DomEnv<A>) {
  return {
    ...domEnv,
    ...wrapInSubscription(domEnv),
  }
}
