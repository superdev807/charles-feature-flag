import { useMaybe } from './useMaybe'

export const useError = () => useMaybe<Error>()
