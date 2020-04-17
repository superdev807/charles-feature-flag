import { descend } from '@typed/list'
import { map } from '@typed/maybe'
import { format } from 'date-fns'
import { FeatureFlagActivity, FeatureFlagActivityLabel } from '../model'

const HUMAN_FORMAT = 'MM/dd/yyyy hh:mm:ss a'

const compareActivities = (a: FeatureFlagActivity, b?: FeatureFlagActivity): boolean => {
  if (!b) {
    return false
  }

  return a.active === b.active && a.enabled === b.enabled && a.deleted === b.deleted
}

export function formatFeatureFlagActivites(
  activity: readonly FeatureFlagActivity[],
): FeatureFlagActivityLabel[] {
  activity = activity.slice().sort((a, b) => descend(x => x.timestamp.getTime(), a, b))

  const labels: FeatureFlagActivityLabel[] = []

  for (let i = 0; i < activity.length; ++i) {
    const currentActivity = activity[i]
    const previousActivity = activity[i + 1]

    if (compareActivities(currentActivity, previousActivity)) {
      continue
    }

    let label = 'Created'
    if (previousActivity) {
      label = diffFeatureFlagActivities(previousActivity, currentActivity)
    }

    labels.push({
      label,
      timestamp: format(currentActivity.timestamp, HUMAN_FORMAT),
      userFullName: map(user => `${user.firstName} ${user.lastName}`, currentActivity.user),
    })
  }

  return labels
}

export function diffFeatureFlagActivities(a: FeatureFlagActivity, b: FeatureFlagActivity): string {
  if (b.deleted) {
    return 'Deleted'
  }

  if (a.enabled && !b.enabled) {
    return 'Disabled'
  }

  if (!a.enabled && b.enabled) {
    return 'Enabled'
  }

  if (a.active && !b.active) {
    return 'Deactivated'
  }

  if (!a.active && b.active) {
    return 'Activated'
  }

  return 'Enabled'
}
