import * as React from 'react'
import { classNames } from '../../../common/classNames'
import { Notification, NotificationProps } from './Notification'

import './Notification.css'

export function EmojiNotification({ emoji, children, ...props }: EmojiNotificationProps) {
  return (
    <Notification {...props}>
      <p className={classNames('notification-emoji')} dangerouslySetInnerHTML={{ __html: emoji }} />

      {children}
    </Notification>
  )
}

export type EmojiNotificationProps = NotificationProps & {
  readonly emoji: string
}
