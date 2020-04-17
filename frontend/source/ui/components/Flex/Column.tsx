import React, { CSSProperties, SFC } from 'react'
import { classNames } from '../../../common/classNames'

import './flexbox.css'

type StyleProps = {
  element?: (el: HTMLElement | null) => void
  style?: CSSProperties
  className?: string
  onClick?: () => void
}

const createColumnComponent = (...classes: readonly string[]): SFC<StyleProps> => {
  const Component: SFC<StyleProps> = React.memo(
    ({ children, element, className, style, onClick }) => (
      <div
        ref={element}
        className={classNames('flex', 'flex-column', ...classes, className)}
        style={style}
        onClick={onClick}
      >
        {children}
      </div>
    ),
  )

  Component.displayName = 'Column'

  return React.memo(Component)
}

export const Column: SFC<StyleProps> = createColumnComponent()

export const FullWidthColumn: SFC<StyleProps> = createColumnComponent('w-100', 'grow-1')
FullWidthColumn.displayName = 'FullWidthColumn'

export const ColumnCenter: SFC<StyleProps> = createColumnComponent('items-center', 'justify-center')
ColumnCenter.displayName = 'ColumnCenter'

export const FullWidthColumnCenter: SFC<StyleProps> = createColumnComponent(
  'items-center',
  'justify-center',
  'w-100',
  'grow-1',
)
FullWidthColumnCenter.displayName = 'FullWidthColumnCenter'

export const ColumnWrap: SFC<StyleProps> = createColumnComponent('flex-wrap')
ColumnWrap.displayName = 'ColumnWrap'
