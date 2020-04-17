import { Effects } from '@typed/effects'
import { Either } from '@typed/either'
import { Jwt } from '@typed/jwt'
import { Maybe } from '@typed/maybe'
import { Uuid } from '@typed/uuid'

export interface AuthAdapter<E> {
  readonly signIn: (username: string, password: string) => Effects<E, Either<Error, User>>
  readonly refreshToken: (token: Jwt) => Effects<E, Either<Error, User>>
  readonly getSavedRefreshToken: () => Effects<E, Maybe<Jwt>>
  readonly saveRefreshToken: (refreshToken: Jwt) => Effects<E, void>
  readonly deleteRefreshToken: () => Effects<E, void>
}

export interface User {
  readonly id: Uuid
  readonly firstName: string
  readonly lastName: string
  readonly email: Maybe<string>
  readonly image: Maybe<string>
  readonly permissions: Permissions
  readonly token: Jwt
}

export enum Permissions {
  // Only permissions levels allowed into ops dashboard
  Data,
  Staff,
  Developer,
}
