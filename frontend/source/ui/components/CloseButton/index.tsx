import { Button } from '@material-ui/core'
import * as React from 'react'

import './CloseButton.css'

export function CloseButton({ onClick, style }: CloseButtonProps) {
  return (
    <Button onClick={onClick} className={'close-button'} style={style}>
      ✕
    </Button>
  )
}

export type CloseButtonProps = {
  readonly onClick: () => void
  readonly style?: React.CSSProperties
}
