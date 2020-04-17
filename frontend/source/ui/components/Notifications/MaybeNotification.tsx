import { isJust, Maybe, unwrap } from '@typed/maybe'
import * as React from 'react'
import { Notification } from './Notification'

export function MaybeNotification<A>({ value, children, ...props }: MaybeNotificationProps<A>) {
  return (
    <Notification open={isJust(value)} {...props}>
      {unwrap(children, value)}
    </Notification>
  )
}

export type MaybeNotificationProps<A> = {
  readonly value: Maybe<A>
  readonly children: (value: A) => React.ReactElement | null

  readonly header?: React.ReactNode
  readonly onClose?: () => void
  readonly disablePortal?: boolean
  readonly className?: string
  readonly style?: React.CSSProperties
}
