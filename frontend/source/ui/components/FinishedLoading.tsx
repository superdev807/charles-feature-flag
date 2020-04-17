import { Theme, useTheme } from '@material-ui/core/styles'
import { isFailure, RemoteData, unpack } from '@typed/remote-data'
import * as React from 'react'
import { PacmanLoader } from 'react-spinners'
import { useErrorContext } from '../context/ErrorContext'
import { ColumnCenter } from './Flex'
import { Notification } from './Notifications/Notification'

export function FinishedLoading<A>({
  data,
  children,
  modal = false,
  header = null,
}: FinishedLoadingProps<A>) {
  const [, setError] = useErrorContext()
  const { palette } = useTheme<Theme>()

  React.useEffect(() => {
    if (isFailure(data)) {
      setError(data.value)
    }
  }, [data.status])

  return unpack(
    () => header,
    () => {
      const color = palette.primary.light

      const loader = (
        <ColumnCenter className="h-100 pa2">{<PacmanLoader color={color} />}</ColumnCenter>
      )

      return (
        <>
          {header}
          {modal ? (
            <Notification open style={{ background: 'none' }}>
              {loader}
            </Notification>
          ) : (
            loader
          )}
        </>
      )
    },
    () => header,
    data => (
      <>
        {header}
        {children(data)}
      </>
    ),
    data,
  )
}

export type FinishedLoadingProps<A> = {
  readonly data: RemoteData<Error, A>
  readonly children: (value: A) => React.ReactElement | null
  readonly modal?: boolean
  readonly header?: React.ReactElement | null
}
