import { FeatureFlag, FlagTab } from '../model'

export function getPreviousTab(flag: FeatureFlag): FlagTab {
  if (!flag.deleted) {
    return flag.longTerm ? FlagTab.LongTerm : FlagTab.Current
  }

  if (flag.deleted) {
    return flag.active ? FlagTab.Deployed : FlagTab.Deleted
  }

  return FlagTab.Current
}
