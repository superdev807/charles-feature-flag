import { Path, pushPath, HistoryEnv } from '@typed/history'
import { Match, oneOf } from '@typed/logic'
import { withDefault } from '@typed/maybe'
import { useState } from 'react'
import { useUpdateEffect } from 'react-use'
import { FlagTab, TabOptions } from '../../domain/model'
import { useDomEnv } from '../context/DomEnvContext'
import { currentRoute, deletedRoute, deployedRoute, flagRoute, longTermRoute } from '../routes'
import { Effects } from '@typed/effects'

const mapTo = <A, B>(value: A, match: Match<B, any>): Match<B, A> => Match.map(() => value, match)

export function useFlagTab() {
  const { location } = useDomEnv()
  const [tab, updateTab] = useState(() => getCurrentTab(location.pathname as Path))

  function* setTab(options: TabOptions): Effects<HistoryEnv, void> {
    yield* pushPath(getCurrentRoute(options))
  }

  useUpdateEffect(() => updateTab(getCurrentTab(location.pathname as Path)), [location.pathname])

  return [tab, setTab] as const
}

function getCurrentTab(pathname: Path): FlagTab {
  const match = oneOf([
    mapTo(FlagTab.Flag, flagRoute.match),
    mapTo(FlagTab.Deployed, deployedRoute.match),
    mapTo(FlagTab.Deleted, deletedRoute.match),
    mapTo(FlagTab.LongTerm, longTermRoute.match),
    mapTo(FlagTab.Current, currentRoute.match),
  ])

  return withDefault(FlagTab.Current, match(pathname))
}

function getCurrentRoute(options: TabOptions) {
  const getRoute = () => {
    switch (options.tab) {
      case FlagTab.Flag:
        return flagRoute.createPath({ flagName: options.flag.name })
      case FlagTab.Deleted:
        return deletedRoute.createPath({})
      case FlagTab.Deployed:
        return deployedRoute.createPath({})
      case FlagTab.LongTerm:
        return longTermRoute.createPath({})
      case FlagTab.Current:
      default:
        return currentRoute.createPath({})
    }
  }

  return withDefault('/' as Path, getRoute())
}
