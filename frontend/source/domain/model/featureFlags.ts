import { Effects } from '@typed/effects'
import { Either } from '@typed/either'
import { Maybe } from '@typed/maybe'
import { Uuid } from '@typed/uuid'

export type FlagOptions = {
  readonly history?: boolean
  readonly longTerm?: boolean
  readonly deleted?: boolean
}

export type TabOptions =
  | {
      readonly tab: Exclude<FlagTab, FlagTab.Flag>
    }
  | {
      readonly tab: FlagTab.Flag
      readonly flag: FeatureFlag
    }

export enum FlagTab {
  Current,
  LongTerm,
  Deployed,
  Deleted,
  Flag,
}

export interface FeatureFlagRepository<E> {
  readonly getFeatureFlags: (
    options?: FlagOptions,
  ) => Effects<E, Either<Error, readonly FeatureFlag[]>>
  readonly getFeatureFlag: (featureFlag: FeatureFlag) => Effects<E, Either<Error, FeatureFlag>>
  readonly createFeatureFlag: (
    name: string,
    longTerm: boolean,
  ) => Effects<E, Either<Error, FeatureFlag>>
  readonly updateFeatureFlag: (
    options: UpdateFeatureFlagOptions,
  ) => Effects<E, Either<Error, FeatureFlag>>
  readonly deleteFeatureFlag: (flag: FeatureFlag) => Effects<E, Either<Error, FeatureFlag>>
}

export interface FeatureFlag {
  readonly name: string // unique
  readonly active: boolean
  readonly enabled: boolean
  readonly deleted: boolean
  readonly description: Maybe<string>
  readonly activity: readonly FeatureFlagActivity[]
  readonly activatedAt: Maybe<Date>
  readonly longTerm: boolean
}

export interface FeatureFlagActivity {
  readonly enabled: boolean
  readonly active: boolean
  readonly deleted: boolean
  readonly timestamp: Date
  readonly user: Maybe<FeatureFlagUser>
}

export interface FeatureFlagUser {
  readonly firstName: string
  readonly lastName: string
}

export type UpdateFeatureFlagOptions = {
  readonly name: string
  readonly status?: FeatureFlagStatus
  readonly description?: string
  readonly storeSpecific?: boolean
  readonly stores?: ReadonlyArray<Uuid>
  readonly longTerm?: boolean
}

export enum FeatureFlagStatus {
  Active = 'activate',
  Inactive = 'deactivate',
  Disabled = 'disable',
  Enabled = 'enable',
}

export type FeatureFlagActivityLabel = {
  readonly label: string
  readonly timestamp: string
  readonly userFullName: Maybe<string>
}
