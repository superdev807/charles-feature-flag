import { Theme, useTheme } from '@material-ui/core/styles'
import * as React from 'react'
import { PacmanLoader } from 'react-spinners'

export const Loading = React.memo(function Loading({ size }: LoadingProps) {
  const { palette } = useTheme<Theme>()

  return <PacmanLoader color={palette.primary.light} size={size} />
})

export type LoadingProps = {
  size?: string | number
}
