import { Modal } from '@material-ui/core'
import * as React from 'react'
import { classNames } from '../../../common/classNames'
import { CloseButton } from '../CloseButton'
import { Column, Row } from '../Flex'

import './Notification.css'

export const Notification = React.memo(function Notification({
  style,
  className,
  disablePortal = false,
  disableEnforceFocus = false,
  disableAutoFocus = false,
  open,
  onClose,
  header,
  children,
}: NotificationProps) {
  return (
    <Modal
      open={open}
      disablePortal={disablePortal}
      disableEnforceFocus={disableEnforceFocus}
      disableAutoFocus={disableAutoFocus}
    >
      <Column className={classNames('notification', className)} style={style}>
        {disablePortal || !onClose ? null : (
          <Row
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              justifyContent: header ? 'space-between' : 'flex-end',
            }}
          >
            {header}
            <CloseButton onClick={onClose} />
          </Row>
        )}
        {children}
      </Column>
    </Modal>
  )
})

export type NotificationProps = {
  readonly open: boolean
  readonly children: React.ReactNode | React.ReactNodeArray

  readonly header?: React.ReactNode
  readonly onClose?: () => void
  readonly disablePortal?: boolean
  readonly className?: string
  readonly style?: React.CSSProperties
  readonly disableEnforceFocus?: boolean
  readonly disableAutoFocus?: boolean
}
