import { Button, Paper, TextField, Typography } from '@material-ui/core'
import { Maybe } from '@typed/maybe'
import * as React from 'react'
import { ColumnCenter } from '../components/Flex'
import { MaybeEmojiNotification } from '../components/Notifications/MaybeEmojiNotification'
import { useAuth } from '../context/AuthContext'

import { useWindowSize } from 'react-use'
import { useMediaQuery } from '../hooks/useMediaQuery'
import './SignIn.css'

export const SignIn = React.memo(function SignIn({ error, clearError }: SignInProps) {
  const isDesktop = useMediaQuery('(min-width: 60em)')
  const { width, height } = useWindowSize()
  const isLandscape = width > height
  const [username, setUsername] = React.useState('')
  const [password, setPassword] = React.useState('')
  const { signIn } = useAuth()
  const mobileLandscape = isLandscape && !isDesktop

  return (
    <>
      <div
        style={{
          position: mobileLandscape ? 'static' : 'absolute',
          margin: '0.5rem auto',
          top: '35%',
          left: '50%',
          transform: mobileLandscape ? '' : 'translate3d(-50%, -50%, 0)',
          width: isDesktop ? 'auto' : '75vw',
        }}
      >
        <Paper className="pa3 pa4-l">
          <ColumnCenter className="h-100 pa1 ph2 ph6-l">
            <Typography component="h2" variant="h4" className="b pv3">
              Sign In
            </Typography>

            <TextField
              name="username"
              className="sign-in--input"
              label="Username"
              value={username}
              placeholder="Email"
              onChange={ev => setUsername(ev.target.value)}
            />

            <TextField
              name="password"
              type="password"
              className="sign-in--input"
              label="Password"
              value={password}
              placeholder="Password"
              onChange={ev => setPassword(ev.target.value)}
            />

            <Button
              variant="contained"
              color="primary"
              fullWidth
              className="sign-in--button"
              onClick={() => signIn(username, password)}
            >
              Sign In
            </Button>
          </ColumnCenter>
        </Paper>
      </div>

      <MaybeEmojiNotification<Error> value={error} emoji={'👾'} onClose={clearError}>
        {({ message }: Error) => <p>{message}</p>}
      </MaybeEmojiNotification>
    </>
  )
})

export type SignInProps = {
  readonly error: Maybe<Error>
  readonly clearError: () => void
}
