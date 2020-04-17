import { Nothing } from '@typed/maybe'
import { useError } from '../hooks/useError'
import { createContextFromHook } from './createContextFromHook'

export const [ErrorProvider, useErrorContext, ErrorContext] = createContextFromHook(
  useError,
  'Error',
  [Nothing, _ => void 0, () => void 0],
)
