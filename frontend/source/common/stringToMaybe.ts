import { Maybe, Nothing } from '@typed/maybe'

export const stringToMaybe = (str: string | null | undefined | void) =>
  !str ? Nothing : Maybe.of(str)
