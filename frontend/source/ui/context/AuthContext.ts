import { Context, NamedExoticComponent } from 'react'
import { AuthAdapter } from '../../domain/model'
import { AuthEnv } from '../../infrastructure/adapters/AuthAdapter'
import { useAuthAdapter } from '../hooks/useAuthAdapter'
import { createContextFromHook } from './createContextFromHook'

export const [AuthProvider, useAuth, AuthContext] = createContextFromHook(
  useAuthAdapter,
  'Auth',
) as readonly [
  NamedExoticComponent<{
    readonly args: [AuthAdapter<AuthEnv>, AuthEnv, number]
    readonly children: React.ReactNode
  }>,
  () => ReturnType<typeof useAuthAdapter>,
  Context<ReturnType<typeof useAuthAdapter>>,
]
