import { DropKeys } from '@typed/common'
import * as React from 'react'
import { classNames } from '../../../common/classNames'
import { useErrorContext } from '../../context/ErrorContext'
import { MaybeEmojiNotification, MaybeEmojiNotificationProps } from './MaybeEmojiNotification'

export function ErrorNotification(props: ErrorNotificationProps) {
  const [error, , clearError] = useErrorContext()

  return (
    <MaybeEmojiNotification emoji="👾" value={error} onClose={clearError} {...props}>
      {error => (
        <>
          <p className={classNames('notification-header')}>Houston, We Have a Problem</p>
          <p className={classNames('notification-text')}>
            Looks like an error occured - please try reloading the page.
          </p>

          <p className={classNames('notification-text')}>{error.message}</p>
        </>
      )}
    </MaybeEmojiNotification>
  )
}

export type ErrorNotificationProps = Partial<
  DropKeys<MaybeEmojiNotificationProps<Error>, 'value' | 'emoji' | 'children' | 'onClose'>
>
