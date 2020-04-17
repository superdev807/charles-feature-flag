import { Uuid } from '@typed/uuid'
import { FeatureFlagStatus } from '../../../domain/model'
import { Api } from './api-types'

export type FeatureFlagException = {
  readonly success: false
  readonly error: string
}

export type FeatureFlagSuccess<A> = {
  readonly success: true
  readonly response: A
}
export type FeatureFlagResponse = FeatureFlagSuccess<Api.FeatureFlag> | FeatureFlagException

export type GetFeatureFlagsResponse =
  | FeatureFlagSuccess<readonly Api.FeatureFlag[]>
  | FeatureFlagException

export type CreateFeatureFlagsRequestBody = {
  readonly flagName: string
  readonly flagDescription?: string
  readonly longTerm?: boolean
}

export type UpdateFeatureFlagRequestBody = {
  readonly flagName: string
  readonly flagDescription?: string
  readonly status?: FeatureFlagStatus
  readonly storeSpecific?: boolean
  readonly storeLocations?: ReadonlyArray<Uuid>
  readonly longTerm?: boolean
}

export type DeleteFeatureFlagRequestBody = {
  readonly flagName: string
}
