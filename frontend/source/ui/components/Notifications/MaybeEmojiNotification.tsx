import { isJust, unwrap } from '@typed/maybe'
import * as React from 'react'
import { EmojiNotification } from './EmojiNotification'
import { MaybeNotificationProps } from './MaybeNotification'

export function MaybeEmojiNotification<A>({
  emoji,
  value,
  children,
  ...props
}: MaybeEmojiNotificationProps<A>) {
  return (
    <EmojiNotification emoji={emoji} open={isJust(value)} {...props}>
      {unwrap(children, value)}
    </EmojiNotification>
  )
}

export type MaybeEmojiNotificationProps<A> = MaybeNotificationProps<A> & {
  readonly emoji: string
}
