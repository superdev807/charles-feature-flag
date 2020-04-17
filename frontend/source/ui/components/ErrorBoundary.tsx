import { isNothing } from '@typed/maybe'
import * as React from 'react'
import { ErrorContext } from '../context/ErrorContext'

export class ErrorBoundary extends React.PureComponent<{}> {
  public static contextType = ErrorContext
  public context!: React.ContextType<typeof ErrorContext>

  public componentDidCatch(error: Error) {
    const [current, setError] = this.context

    if (isNothing(current)) {
      setError(error)
    }
  }

  public render() {
    return this.props.children
  }
}
