import { Fn } from '@typed/lambda'
import React, {
  Context,
  createContext,
  memo,
  ReactNode,
  ReactNodeArray,
  SFC,
  useContext,
} from 'react'

export function createContextFromHook<A extends any[], B>(
  fn: Fn<A, B>,
  displayName: string,
  defaultValue?: B,
) {
  const HookContext: Context<B> = createContext(defaultValue || ({} as any))

  const Provider: SFC<
    A extends []
      ? { readonly children: ReactNode | ReactNodeArray }
      : { readonly args: A; readonly children: ReactNode | ReactNodeArray }
  > = ({ args = [], children }) => {
    return <HookContext.Provider value={fn(...(args as any))}>{children}</HookContext.Provider>
  }

  Provider.displayName = displayName

  return [memo(Provider), () => useContext(HookContext), HookContext] as const
}
