import React, { CSSProperties, SFC } from 'react'
import { classNames } from '../../../common/classNames'
import './flexbox.css'

type StyleProps = {
  style?: CSSProperties
  className?: string
  onClick?: () => void
  element?: (el: HTMLElement | null) => void
}

export const createRowComponent = (...classes: readonly string[]): SFC<StyleProps> => {
  const Component: SFC<StyleProps> = React.memo(
    ({ children, element, className, style, onClick }) => (
      <div
        ref={element}
        className={classNames('flex', ...classes, className)}
        style={style}
        onClick={onClick}
      >
        {children}
      </div>
    ),
  )

  Component.displayName = 'Row'

  return React.memo(Component)
}

export const Row: SFC<StyleProps> = createRowComponent()

export const FullWidthRow: SFC<StyleProps> = createRowComponent('w-100', 'grow-1')
FullWidthRow.displayName = 'FullWidthRow'

export const RowAlignCenter: SFC<StyleProps> = createRowComponent('items-center')
RowAlignCenter.displayName = 'RowAlignCenter'

export const RowJustifyCenter: SFC<StyleProps> = createRowComponent('justify-center')
RowJustifyCenter.displayName = 'RowJustifyCenter'

export const RowCenter: SFC<StyleProps> = createRowComponent('items-center', 'justify-center')
RowCenter.displayName = 'RowCenter'

export const RowBetween: SFC<StyleProps> = createRowComponent('justify-between')
RowBetween.displayName = 'RowBetween'

export const RowSpaceAround: SFC<StyleProps> = createRowComponent('justify-around')
RowSpaceAround.displayName = 'RowSpaceAround'

export const RowWrap: SFC<StyleProps> = createRowComponent('flex-wrap')
RowWrap.displayName = 'RowWrap'

export const RowBetweenCenter: SFC<StyleProps> = createRowComponent(
  'justify-between',
  'items-center',
)
