import { Nothing } from '@typed/maybe'
import { describe, given, it } from '@typed/test'
import { FeatureFlag, FlagTab } from '../model'
import { getPreviousTab } from './getPreviousTab'

export const test = describe(`getPreviousTab`, [
  given(`a FeatureFlag `, [
    it(`returns FlagTab`, ({ equal }) => {
      equal(FlagTab.LongTerm, getPreviousTab(createFlag({ longTerm: true })))
      equal(FlagTab.Current, getPreviousTab(createFlag({ longTerm: false })))
      equal(FlagTab.Deployed, getPreviousTab(createFlag({ deleted: true, active: true })))
      equal(FlagTab.Deleted, getPreviousTab(createFlag({ deleted: true, active: false })))
    }),
  ]),
])

function createFlag(options: Partial<FeatureFlag>): FeatureFlag {
  return {
    name: 'feature-flag',
    enabled: false,
    active: false,
    longTerm: false,
    deleted: false,
    description: Nothing,
    activity: [],
    activatedAt: Nothing,
    storeSpecific: false,
    stores: [],
    ...options,
  }
}
