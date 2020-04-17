import { runEffects, Effects } from '@typed/effects'
import { fromLeft, fromRight, isLeft, unpack } from '@typed/either'
import { Path, HistoryEnv } from '@typed/history'
import { uniqBy } from '@typed/list'
import { isUndefined } from '@typed/logic'
import { fromJust, map, Nothing, isNothing } from '@typed/maybe'
import { isSuccess, Loading, NoData, RemoteData } from '@typed/remote-data'
import { useGetSet } from 'react-use'
import { stringToMaybe } from '../../common/stringToMaybe'
import {
  FeatureFlag,
  FeatureFlagRepository,
  FeatureFlagStatus,
  FlagTab,
  TabOptions,
  UpdateFeatureFlagOptions,
} from '../../domain/model'
import { tabToFlagOptions } from '../../domain/services'
import { useDomEnv } from '../context/DomEnvContext'
import { useErrorContext } from '../context/ErrorContext'
import { flagRoute } from '../routes'
import { useDisposable } from './useDisposable'
import { useFlagTab } from './useFlagTab'
import { RouteParams } from '@typed/routing'

export function useFeatureFlagRepository<E>(repo: FeatureFlagRepository<E>, environment: E) {
  const [, setError] = useErrorContext()
  const domEnv = useDomEnv()
  const [getFeatureFlags, setFeatureFlags] = useGetSet<RemoteData<Error, readonly FeatureFlag[]>>(
    NoData,
  )
  const [getFlag, setFlag] = useGetSet<RemoteData<Error, FeatureFlag>>(NoData)
  const [tab, updateTab] = useFlagTab()

  const getCurrentFlags = () => getFeatureFlagsFromRemoteData(getFeatureFlags())

  function* setTab(options: TabOptions) {
    if (options.tab === FlagTab.Flag) {
      setFlag(RemoteData.of(options.flag))
    }

    yield* updateTab(options)
  }

  function addOrUpdateFlags(
    newOrUpdatedFlags: readonly FeatureFlag[],
    currentFlags: readonly FeatureFlag[],
  ) {
    setFeatureFlags(RemoteData.of(uniqBy(x => x.name, [...newOrUpdatedFlags, ...currentFlags])))

    const flag = getFlag()

    if (isSuccess(flag)) {
      const currentFlagName = flag.value.name
      const flagIndex = newOrUpdatedFlags.findIndex(flag => flag.name === currentFlagName)

      if (flagIndex > -1) {
        setFlag(RemoteData.of(newOrUpdatedFlags[flagIndex]))
      }
    }
  }

  function* loadFlags(): Effects<E, void> {
    const currentFlags = getCurrentFlags()

    setFeatureFlags(Loading)

    const featureFlags = yield* repo.getFeatureFlags(tabToFlagOptions(tab))

    if (isLeft(featureFlags)) {
      return setError(fromLeft(featureFlags))
    }

    addOrUpdateFlags(fromRight(featureFlags), currentFlags)
  }

  function* loadFlagFromUrl(): Effects<E, void> {
    const { location } = domEnv
    const flagName = map(
      ({ flagName }: RouteParams<typeof flagRoute>) => flagName,
      flagRoute.match(location.pathname as Path),
    )

    if (isNothing(flagName)) {
      return setError(new Error('Unable to find flag by name'))
    }

    yield* loadFlag(createEmptyFlag(fromJust(flagName)))
  }

  function* loadFlag(flag: FeatureFlag): Effects<E, void> {
    const currentFlags = getCurrentFlags()

    setFlag(Loading)

    const response = yield* repo.getFeatureFlag(flag)

    if (isLeft(response)) {
      return setError(fromLeft(response))
    }

    const featureFlag = fromRight(response)

    setFlag(RemoteData.of(featureFlag))
    addOrUpdateFlags([featureFlag], currentFlags)
  }

  function* getFlags(): Effects<E, void> {
    if (tab !== FlagTab.Flag) {
      setFlag(NoData)

      return yield* loadFlags()
    }

    const flag = getFlag()

    if (isSuccess(flag)) {
      return yield* loadFlag(flag.value)
    }

    setFlag(NoData)

    yield* loadFlagFromUrl()
  }

  function* createFlag(name: string, longTerm: boolean): Effects<E & HistoryEnv, void> {
    const featureFlag = yield* repo.createFeatureFlag(name, longTerm)

    if (isLeft(featureFlag)) {
      return setError(fromLeft(featureFlag))
    }

    const flag = fromRight(featureFlag)

    addOrUpdateFlags([flag], getFeatureFlagsFromRemoteData(getFeatureFlags()))

    yield* setTab({ tab: FlagTab.Flag, flag })
  }

  function* updateFlag(options: UpdateFeatureFlagOptions): Effects<E, void> {
    const currentFlags = getCurrentFlags()
    const currentFlag = getFlag()
    const flagToUpdate = currentFlags.find(flag => flag.name === options.name)

    // Optimistic updates - improves UX by speeding up feedback
    if (flagToUpdate) {
      addOrUpdateFlags([applyOptimisticUpdates(options, flagToUpdate)], currentFlags)
    }

    const updatedFlag = yield* repo.updateFeatureFlag(options)

    unpack(
      error => {
        setError(error)
        // Undo optimistic updates on error
        setFlag(currentFlag)
        setFeatureFlags(RemoteData.of(currentFlags))
      },
      flag => addOrUpdateFlags([flag], currentFlags),
      updatedFlag,
    )
  }

  function* deleteFlag(flag: FeatureFlag): Effects<E, void> {
    const deletedFlag = yield* repo.deleteFeatureFlag(flag)

    if (isLeft(deletedFlag)) {
      return setError(fromLeft(deletedFlag))
    }

    addOrUpdateFlags([fromRight(deletedFlag)], getCurrentFlags())
  }

  useDisposable(() => runEffects(getFlags(), environment), [tab])

  return {
    featureFlags: getFeatureFlags(),
    flag: getFlag(),
    tab,
    setTab: (options: TabOptions) => runEffects(setTab(options), domEnv),
    createFlag: (name: string, longTerm: boolean) =>
      runEffects(createFlag(name, longTerm), { ...environment, ...domEnv }),
    updateFlag: (options: UpdateFeatureFlagOptions) => runEffects(updateFlag(options), environment),
    deleteFlag: (flag: FeatureFlag) => runEffects(deleteFlag(flag), environment),
  } as const
}

function createEmptyFlag(name: string): FeatureFlag {
  return {
    name,
    enabled: true,
    active: true,
    activatedAt: Nothing,
    deleted: true,
    longTerm: true,
    activity: [],
    description: Nothing,
  }
}

function applyOptimisticUpdates(options: UpdateFeatureFlagOptions, flag: FeatureFlag): FeatureFlag {
  const updated = { ...flag }

  if (!isUndefined(options.description)) {
    updated.description = stringToMaybe(options.description)
  }

  if (!isUndefined(options.longTerm)) {
    updated.longTerm = options.longTerm
  }

  if (!isUndefined(options.status)) {
    if (options.status === FeatureFlagStatus.Active) {
      updated.active = true
    }

    if (options.status === FeatureFlagStatus.Disabled) {
      updated.enabled = false
      updated.active = false
    }

    if (options.status === FeatureFlagStatus.Enabled) {
      updated.enabled = true
      updated.deleted = false
    }

    if (options.status === FeatureFlagStatus.Inactive) {
      updated.active = false
    }
  }

  return updated
}

function getFeatureFlagsFromRemoteData(
  flags: RemoteData<Error, readonly FeatureFlag[]>,
): readonly FeatureFlag[] {
  if (isSuccess(flags)) {
    return flags.value
  }

  return []
}
