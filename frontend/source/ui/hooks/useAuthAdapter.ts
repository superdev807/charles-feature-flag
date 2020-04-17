import { Disposable } from '@typed/disposable'
import { runEffects, Effects } from '@typed/effects'
import { isRight } from '@typed/either'
import { fromJust, isJust, unpack } from '@typed/maybe'
import { isSuccess, Loading, NoData, RemoteData } from '@typed/remote-data'
import { whenIdle } from '@typed/timer'
import { useState } from 'react'
import { useEffectOnce } from 'react-use'
import { AuthAdapter, User } from '../../domain/model'
import { useHttpEnv } from '../context/HttpEnvContext'
import { useTimer } from '../context/TimerContext'
import { useDisposable } from './useDisposable'
import { useMaybe } from './useMaybe'

const AUTHORIZATION_HEADER = 'Authorization'

export function useAuthAdapter<E>(
  adapter: AuthAdapter<E>,
  environment: E,
  refreshTimingMs: number,
) {
  const { addHttpHeader, removeHttpHeader } = useHttpEnv()
  const timer = useTimer()
  const [user, setUser] = useState<RemoteData<Error, User>>(NoData)
  const [lastRun, setLastRun] = useMaybe<number>()
  const shouldRefreshToken = () =>
    unpack(
      time => timer.currentTime() - time > refreshTimingMs,
      () => true,
      lastRun,
    )

  function* signIn(username: string, password: string): Effects<E, void> {
    setUser(Loading)

    const user = yield* adapter.signIn(username, password)

    if (isRight(user)) {
      setLastRun(timer.currentTime())
    }

    setUser(RemoteData.fromEither(user))
  }

  function* signOut(): Effects<E, void> {
    yield* adapter.deleteRefreshToken()

    setUser(NoData)
  }

  function* refreshToken(): Effects<E, void> {
    const token = yield* adapter.getSavedRefreshToken()

    if (isJust(token) && shouldRefreshToken()) {
      setUser(Loading)
      const user = yield* adapter.refreshToken(fromJust(token))

      if (isRight(user)) {
        setLastRun(timer.currentTime())
      }

      setUser(RemoteData.fromEither(user))
    }
  }

  // On startup try to get a user by using a save refresh token
  useEffectOnce(() => {
    const { dispose } = runEffects(refreshToken(), environment)

    return dispose
  })

  // Whenever the browser is idle and things have changed get a new refresh token
  useDisposable(() => {
    if (isSuccess(user) && shouldRefreshToken()) {
      setLastRun(timer.currentTime())

      const disposable = Disposable.lazy()

      disposable.addDisposable(
        whenIdle(() => {
          disposable.addDisposable(runEffects(refreshToken(), environment))
        }, timer),
      )

      return disposable
    }

    return Disposable.None
  }, [adapter, user])

  // Add Authorization header to HttpEnv when authenticated
  useDisposable(() => {
    if (isSuccess(user)) {
      const { token } = user.value

      addHttpHeader(AUTHORIZATION_HEADER, `JWT ${token}`)

      return runEffects(adapter.saveRefreshToken(token), environment)
    }

    removeHttpHeader(AUTHORIZATION_HEADER)

    return Disposable.None
  }, [user])

  return {
    user,
    signIn: (username: string, password: string) =>
      runEffects(signIn(username, password), environment),
    signOut: () => runEffects(signOut(), environment),
  } as const
}
