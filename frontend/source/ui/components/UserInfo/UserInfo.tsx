import { Typography } from '@material-ui/core'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import { unpack } from '@typed/maybe'
import * as React from 'react'
import { User } from '../../../domain/model'
import { useAuth } from '../../context/AuthContext'
import { RowAlignCenter } from '../Flex'

import { useMediaQuery } from '../../hooks/useMediaQuery'
import './UserInfo.css'

export const UserInfo = React.memo(function UserInfo({ user }: UserInfoProps) {
  const { signOut } = useAuth()
  const isTablet = useMediaQuery('(min-width: 30em)')
  const { image, firstName, lastName } = user

  return (
    <RowAlignCenter className="user-info">
      {isTablet &&
        unpack(
          src => <img className="user-info--image" src={src} />,
          () => <FallbackUserImage />,
          image,
        )}

      {isTablet && (
        <Typography className="pa2 white">
          {firstName} {lastName}
        </Typography>
      )}

      <ExitToAppIcon className="user-info--exit" style={{ fill: 'white' }} onClick={signOut} />
    </RowAlignCenter>
  )
})

export type UserInfoProps = {
  readonly user: User
}

export function FallbackUserImage({ height = '4rem' }) {
  return (
    <svg
      fill="#CECECE"
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      x="0px"
      y="0px"
      viewBox="0 0 24 24"
      enableBackground="new 0 0 24 24;"
      height={height}
    >
      <g>
        <path d="M12,2C6.5,2,2,6.5,2,12c0,5.5,4.5,10,10,10s10-4.5,10-10C22,6.5,17.5,2,12,2z M12,20c-2.6,0-4.9-1.3-6.4-3.2   c0.9-0.9,2.5-1.7,4.5-1.9c0.1-0.3,0.2-0.5,0.2-0.8c0-0.3-0.1-0.5-0.2-0.8c-1-0.7-1.7-1.9-1.7-3.4C8.5,7.8,10.1,6,12,6   s3.5,1.8,3.5,3.9c0,1.4-0.7,2.7-1.7,3.4c-0.1,0.2-0.2,0.5-0.2,0.8c0,0.3,0.1,0.6,0.2,0.8c2,0.3,3.7,1,4.5,1.9   C16.9,18.7,14.6,20,12,20z" />
      </g>
    </svg>
  )
}
