import { ascend, sort } from '@typed/list'
import { map, withDefault } from '@typed/maybe'
import { FeatureFlag } from '../model'

export function sortFlagsByActivation(flags: readonly FeatureFlag[]): readonly FeatureFlag[] {
  return sort(ascend(getActivationValue), flags)
}

function getActivationValue(flag: FeatureFlag): number {
  return withDefault(
    Infinity,
    map(date => date.getTime(), flag.activatedAt),
  )
}
