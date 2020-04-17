import { AppBar, Toolbar, Typography } from '@material-ui/core'
import * as React from 'react'
import { useDomEnv } from '../../context/DomEnvContext'
import { RowAlignCenter } from '../Flex'

import './Header.css'

export const Header: React.FC<HeaderProps> = React.memo(({ children }) => {
  const { history } = useDomEnv()

  return (
    <AppBar position="relative">
      <Toolbar style={{ justifyContent: 'space-between', padding: '0.25rem' }}>
        <RowAlignCenter>
          <img className="header--logo" src="https://olla.co/f95d4f8335a9874a.png" />

          <Typography
            component="h1"
            variant="h6"
            className="white pointer"
            onClick={() => history.pushState(null, '', '/')}
          >
            Feature Flags
          </Typography>
        </RowAlignCenter>

        {children}
      </Toolbar>
    </AppBar>
  )
})

export type HeaderProps = {}
