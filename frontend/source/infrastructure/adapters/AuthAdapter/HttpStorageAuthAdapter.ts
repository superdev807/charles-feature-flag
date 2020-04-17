import { DomEnv } from '@typed/dom'
import { chain, Either, fromRight, isRight, Left, Right } from '@typed/either'
import { get, http, HttpEnv, toJson } from '@typed/http'
import { Jwt, getClaims } from '@typed/jwt'
import { Maybe } from '@typed/maybe'
import { StorageEnv, getItem, setItem, removeItem } from '@typed/storage'
import { Uuid } from '@typed/uuid'
import { stringToMaybe } from '../../../common/stringToMaybe'
import { createUrl } from '../../../common/urls'
import { AuthAdapter, Permissions, User } from '../../../domain/model'
import { Api } from './api-types'

const JSON_HEADERS = {
  'Content-Type': 'application/json',
}
const OPS_ROLES: Api.Permissions[] = ['STAFF', 'DATA', 'DEVELOPER']

export interface AuthEnv extends HttpEnv, DomEnv, StorageEnv {}

export function createAuthAdapter(domain: string, tokenStorageKey: string): AuthAdapter<AuthEnv> {
  function* getUserByToken(token: Jwt) {
    const { user_id } = getClaims<{ readonly user_id: Uuid }>(token)
    const url = createUrl(domain, '/users/')
    const response = toJson(
      yield* get<{ user: Api.User }>(url, {
        queryParameters: { user_id },
        headers: {
          Authorization: `JWT ${token}`,
        },
      }),
    )

    return chain(({ user }) => convertUser(user, token), response)
  }

  function* saveRefreshToken(refreshToken: Jwt) {
    yield* setItem(tokenStorageKey, refreshToken)
  }

  function* deleteRefreshToken() {
    yield* removeItem(tokenStorageKey)
  }

  function* getSavedRefreshToken() {
    const maybe = yield* getItem(tokenStorageKey)

    return maybe as Maybe<Jwt>
  }

  function* refreshToken(token: Jwt) {
    const url = createUrl(domain, '/api-token-refresh/')
    const refreshToken = toJson(
      yield* http<{ token: Jwt }>(url, {
        method: 'POST',
        headers: {
          ...JSON_HEADERS,
          Authorization: `JWT ${token}`,
        },
        body: JSON.stringify({ token }),
      }),
    )

    if (!isRight(refreshToken)) {
      return refreshToken
    }

    return yield* getUserByToken(fromRight(refreshToken).token)
  }

  function* signIn(username: string, password: string) {
    const url = createUrl(domain, '/api-token-auth/')
    const body = { username, password }
    const authToken = toJson(
      yield* http<{ token: Jwt } | { non_field_errors: [string] }>(url, {
        method: 'POST',
        headers: JSON_HEADERS,
        body: JSON.stringify(body),
      }),
    )

    if (!isRight(authToken)) {
      return authToken
    }

    const value = fromRight(authToken)

    if (Object.hasOwnProperty.call(value, 'non_field_errors')) {
      return Left.of(new Error((value as any).non_field_errors[0]))
    }

    const { token } = value as { token: Jwt }

    return yield* refreshToken(token)
  }

  return {
    signIn,
    refreshToken,
    getSavedRefreshToken,
    saveRefreshToken,
    deleteRefreshToken,
  }
}

function convertUser(user: Api.User, token: Jwt): Either<Error, User> {
  if (!OPS_ROLES.includes(user.role) || user.is_managed) {
    return Left.of(new Error(`Non-ops user not allowed access.`))
  }

  return Right.of({
    id: user.id,
    firstName: user.first_name,
    lastName: user.last_name,
    email: stringToMaybe(user.email),
    image: stringToMaybe(user.default_image),
    permissions: convertRole(user.role as Api.OpsPermissions, user.is_staff),
    token,
    intercomIdentity: user.intercomIdentity,
  })
}

function convertRole(role: Api.OpsPermissions, isStaff: boolean): Permissions {
  if (role === 'DEVELOPER') {
    return Permissions.Developer
  }

  return isStaff || role === 'STAFF' ? Permissions.Staff : Permissions.Data
}
