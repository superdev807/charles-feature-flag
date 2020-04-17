import { FlagOptions, FlagTab } from '../model'

export function tabToFlagOptions<A extends FlagTab>(tab: A): FlagOptions {
  switch (tab) {
    case FlagTab.Deleted:
    case FlagTab.Deployed:
      return { deleted: true }
    case FlagTab.LongTerm:
      return { longTerm: true }
    default:
      return {}
  }
}
