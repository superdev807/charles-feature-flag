import { HttpEnv } from '@typed/http'
import { FeatureFlagRepository } from '../../domain/model'
import { useHttpEnv } from '../context/HttpEnvContext'
import { useTimer } from '../context/TimerContext'
import { useCreateFlag } from './useCreateFlag'
import { useFeatureFlagRepository } from './useFeatureFlagRepository'

export function useDashboard(
  featureFlagRepository: FeatureFlagRepository<HttpEnv>,
  expiration: number,
) {
  const timer = useTimer()
  const { httpEnv } = useHttpEnv({ timer, expiration })

  return {
    ...useFeatureFlagRepository(featureFlagRepository, httpEnv),
    ...useCreateFlag(),
  } as const
}
