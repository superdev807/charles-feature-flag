import { HttpEnv } from '@typed/http'
import { isJust, Maybe, Nothing } from '@typed/maybe'
import { unpack } from '@typed/remote-data'
import * as React from 'react'
import { FeatureFlagRepository } from '../domain/model'
import { FinishedLoading } from './components/FinishedLoading'
import { Header } from './components/Header'
import { ErrorNotification } from './components/Notifications/ErrorNotification'
import { UserInfo } from './components/UserInfo'
import { useAuth } from './context/AuthContext'
import { useErrorContext } from './context/ErrorContext'
import { Dashboard } from './views/Dashboard'
import { SignIn } from './views/SignIn'

import './App.css'

export function App({ featureFlagRepository, featureFlagExpiration }: AppProps) {
  const { user, signOut } = useAuth()
  const [contextError] = useErrorContext()

  return (
    <>
      <Header>
        <FinishedLoading data={user} modal>
          {user => <UserInfo user={user} />}
        </FinishedLoading>
      </Header>

      <main
        className="h-100 bg-light-gray relative pa2 pb6"
        style={{ flexGrow: 1, overflow: 'hidden auto' }}
      >
        {unpack(
          () => (
            <SignIn error={Nothing} clearError={signOut} />
          ),
          () => (
            <SignIn error={Nothing} clearError={signOut} />
          ),
          error => (
            <SignIn error={isJust(contextError) ? Nothing : Maybe.of(error)} clearError={signOut} />
          ),
          user => (
            <Dashboard
              user={user}
              featureFlagRepository={featureFlagRepository}
              expiration={featureFlagExpiration}
            />
          ),
          user,
        )}
      </main>

      <ErrorNotification />
    </>
  )
}

export type AppProps = {
  readonly featureFlagRepository: FeatureFlagRepository<HttpEnv>
  readonly featureFlagExpiration: number
}
