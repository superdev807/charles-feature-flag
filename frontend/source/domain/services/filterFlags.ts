import { isJust, isNothing } from '@typed/maybe'
import { FeatureFlag, FlagTab } from '../model'

export function filterFlags(tab: FlagTab, flags: readonly FeatureFlag[]): readonly FeatureFlag[] {
  return flags.filter(tabPredicate(tab))
}

function tabPredicate(tab: FlagTab) {
  return (flag: FeatureFlag) => {
    switch (tab) {
      case FlagTab.Current:
        return !flag.deleted && !flag.longTerm
      case FlagTab.Deleted:
        return flag.deleted && isNothing(flag.activatedAt)
      case FlagTab.Deployed:
        return flag.deleted && isJust(flag.activatedAt)
      case FlagTab.LongTerm:
        return !flag.deleted && flag.longTerm
      default:
        return true
    }
  }
}
