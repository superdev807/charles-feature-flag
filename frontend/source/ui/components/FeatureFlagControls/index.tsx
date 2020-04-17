import { Tab, Tabs } from '@material-ui/core'
import * as React from 'react'
import { FlagTab, TabOptions } from '../../../domain/model'
import { RowAlignCenter } from '../Flex'

export function FeatureFlagControls({ tab, setTab }: FeatureFlagControlsProps) {
  return (
    <RowAlignCenter>
      {tab !== FlagTab.Flag && (
        <Tabs
          variant="fullWidth"
          scrollButtons="on"
          indicatorColor="primary"
          textColor="primary"
          className="w-100"
          value={tab}
          onChange={(_, tab: Exclude<FlagTab, FlagTab.Flag>) => setTab({ tab })}
        >
          <Tab label="Current" value={FlagTab.Current} />
          <Tab label="Long Term" style={{ whiteSpace: 'nowrap' }} value={FlagTab.LongTerm} />
          <Tab label="Deployed" value={FlagTab.Deployed} />
          <Tab label="Deleted" value={FlagTab.Deleted} />
        </Tabs>
      )}
    </RowAlignCenter>
  )
}

export type FeatureFlagControlsProps = {
  readonly tab: FlagTab
  readonly setTab: (options: TabOptions) => void
}
