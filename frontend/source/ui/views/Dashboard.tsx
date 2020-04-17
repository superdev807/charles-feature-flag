import { HttpEnv } from '@typed/http'
import { unpack } from '@typed/remote-data'
import * as React from 'react'
import { FeatureFlag, FeatureFlagRepository, FlagTab, User } from '../../domain/model'
import { filterFlags, sortFlagsByActivation } from '../../domain/services'
import { CreateFlag } from '../components/CreateFlag'
import { FeatureFlagControls } from '../components/FeatureFlagControls'
import { FinishedLoading } from '../components/FinishedLoading'
import { Flag } from '../components/Flag'
import { FlagSummary } from '../components/FlagSummary'
import { ColumnCenter } from '../components/Flex'
import { Loading } from '../components/Loading'
import { useDashboard } from '../hooks/useDashboard'

import './Dashboard.css'

export const Dashboard = React.memo(function Dashboard({
  user,
  featureFlagRepository,
  expiration,
}: DashboardProps) {
  const {
    featureFlags,
    flag,
    tab,
    setTab,
    updateFlag,
    deleteFlag,
    createFlag,
    creatingFeatureFlag,
    setCreatingFeatureFlag,
    featureFlagName,
    setFeatureFlagName,
  } = useDashboard(featureFlagRepository, expiration)

  const flags = (
    <FinishedLoading<readonly FeatureFlag[]>
      header={<FeatureFlagControls tab={tab} setTab={setTab} />}
      data={featureFlags}
    >
      {(flags: readonly FeatureFlag[]): React.ReactElement => (
        <>
          <section className="pa2 pa3-ns">
            {sortFlagsByActivation(filterFlags(tab, flags)).map(flag => (
              <FlagSummary
                key={flag.name}
                flag={flag}
                selectFlag={() => setTab({ tab: FlagTab.Flag, flag })}
                updateFlag={updateFlag}
              />
            ))}
          </section>

          <CreateFlag
            tab={tab}
            createFlag={createFlag}
            creatingFeatureFlag={creatingFeatureFlag}
            setCreatingFeatureFlag={setCreatingFeatureFlag}
            featureFlagName={featureFlagName}
            setFeatureFlagName={setFeatureFlagName}
          />
        </>
      )}
    </FinishedLoading>
  )

  return (
    <>
      {unpack(
        () => flags,
        () => (
          <>
            <FeatureFlagControls tab={tab} setTab={setTab} />

            <ColumnCenter className="h-100">
              <Loading />
            </ColumnCenter>
          </>
        ),
        () => flags,
        flag => (
          <Flag
            permissions={user.permissions}
            flag={flag}
            updateFlag={updateFlag}
            deleteFlag={deleteFlag}
          />
        ),
        flag,
      )}
    </>
  )
})

export type DashboardProps = {
  readonly user: User
  readonly featureFlagRepository: FeatureFlagRepository<HttpEnv>
  readonly expiration: number
}
