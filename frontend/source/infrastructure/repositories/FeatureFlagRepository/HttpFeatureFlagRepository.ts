import { Either, fromRight, isLeft, Left, Right } from '@typed/either'
import { get, http, HttpEnv, toJson } from '@typed/http'
import { isUndefined } from '@typed/logic'
import { Just, map, Maybe, Nothing } from '@typed/maybe'
import { keysOf } from '@typed/objects'
import { parseISO } from 'date-fns'
import { createUrl } from '../../../common/urls'
import {
  FeatureFlag,
  FeatureFlagActivity,
  FeatureFlagRepository,
  FeatureFlagUser,
  FlagOptions,
  UpdateFeatureFlagOptions,
} from '../../../domain/model'
import { Api as AuthApi } from '../../adapters/AuthAdapter/api-types'
import { Api } from './api-types'
import {
  CreateFeatureFlagsRequestBody,
  DeleteFeatureFlagRequestBody,
  FeatureFlagResponse,
  GetFeatureFlagsResponse,
  UpdateFeatureFlagRequestBody,
} from './types'

export function createFeatureFlagRepository(domain: string): FeatureFlagRepository<HttpEnv> {
  const url = createUrl(domain, '/app/v1/featureflag/')

  function* getFeatureFlags(options: FlagOptions = {}) {
    const queryParameters = convertOptions(options)
    const url = createUrl(domain, '/app/v1/featureflags/')
    const response = toJson(
      yield* get<GetFeatureFlagsResponse>(url, { queryParameters }),
    )

    if (isLeft(response)) {
      return response
    }

    const responseJson = fromRight(response)

    return responseJson.success
      ? Right.of(responseJson.response.map(convertFeatureFlag))
      : Left.of(new Error(responseJson.error))
  }

  function handleResponse(response: Either<Error, FeatureFlagResponse>) {
    if (isLeft(response)) {
      return response
    }

    const responseJson = fromRight(response)

    return responseJson.success
      ? Right.of(convertFeatureFlag(responseJson.response))
      : Left.of(new Error(responseJson.error))
  }

  function* getFeatureFlag(flag: FeatureFlag) {
    const response = toJson(
      yield* get<FeatureFlagResponse>(url, {
        queryParameters: {
          flagName: flag.name,
          includeHistory: void 0,
          includeDeleted: void 0,
          includeLongTerm: void 0,
        },
      }),
    )

    return handleResponse(response)
  }

  function* createFeatureFlag(name: string, longTerm: boolean) {
    const body: CreateFeatureFlagsRequestBody = {
      flagName: name,
      longTerm,
    }
    const response = toJson(
      yield* http<FeatureFlagResponse>(url, {
        method: 'POST',
        body: JSON.stringify(body),
      }),
    )

    return handleResponse(response)
  }

  function* updateFeatureFlag(options: UpdateFeatureFlagOptions) {
    const body: UpdateFeatureFlagRequestBody = {
      flagName: options.name,
      flagDescription: options.description,
      status: options.status,
      storeLocations: options.stores,
      storeSpecific: options.storeSpecific,
      longTerm: options.longTerm,
    }

    for (const key of keysOf(body)) {
      if (isUndefined(body[key])) {
        delete body[key]
      }
    }

    const either = toJson(
      yield* http<FeatureFlagResponse>(url, {
        method: 'PUT',
        body: JSON.stringify(body),
      }),
    )

    return handleResponse(either)
  }

  function* deleteFeatureFlag(flag: FeatureFlag) {
    const body: DeleteFeatureFlagRequestBody = {
      flagName: flag.name,
    }

    const either = toJson(
      yield* http<FeatureFlagResponse>(url, {
        method: 'DELETE',
        body: JSON.stringify(body),
      }),
    )

    return handleResponse(either)
  }

  return {
    getFeatureFlags,
    getFeatureFlag,
    createFeatureFlag,
    updateFeatureFlag,
    deleteFeatureFlag,
  }
}

function convertOptions(options: FlagOptions): Record<string, string | undefined> {
  const queryParameters: Record<string, string | undefined> = {}

  keysOf(options).forEach(key => {
    if (options[key]) {
      queryParameters['include' + captialize(key)] = undefined
    }
  })

  return queryParameters
}

function captialize(str: string) {
  return str ? `${str[0].toUpperCase()}${str.slice(1)}` : ''
}

function convertFeatureFlag(api: Api.FeatureFlag): FeatureFlag {
  const flag: FeatureFlag = {
    name: api.name,
    active: api.active,
    enabled: api.enabled,
    deleted: api.deleted,
    longTerm: api.long_term,
    description: stringToMaybe(api.description),
    activity: api.history ? api.history.map(convertHistory) : [],
    activatedAt: api.activated_at ? Just.of(parseISO(api.activated_at)) : Nothing,
  }

  return flag
}

function convertHistory(api: Api.FeatureFlagHistory): FeatureFlagActivity {
  const activity: FeatureFlagActivity = {
    active: api.active,
    enabled: api.enabled,
    deleted: api.deleted,
    timestamp: parseISO(api.history_date),
    user: map(convertUser, Maybe.of(api.history_user)),
  }

  return activity
}

function convertUser(api: AuthApi.User): FeatureFlagUser {
  return {
    firstName: api.first_name,
    lastName: api.last_name,
  }
}

function stringToMaybe(str: string | null | undefined | void): Maybe<string> {
  return !str || str.length === 0 ? Nothing : Maybe.of(str)
}
