import { Api as AuthApi } from '../../adapters/AuthAdapter/api-types'

export namespace Api {
  export type FeatureFlag = {
    active: boolean
    deleted: boolean
    enabled: boolean
    description: string
    name: string
    activated_at: string | null
    long_term: boolean
    history?: readonly FeatureFlagHistory[]
  }

  export type FeatureFlagHistory = {
    active: boolean
    deleted: boolean
    enabled: boolean
    description: string
    history_date: string
    history_user: AuthApi.User | null
  }
}
