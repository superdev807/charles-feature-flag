import { MINUTE } from './common/timer'

export const ROOT_ELEMENT_SELECTOR = `#root`
export const API_DOMAIN = process.env.API_DOMAIN || `api.olla.co`
export const AUTH_REFRESH_TOKEN_KEY = `auth-refresh-token`
export const AUTH_REFRESH_TIMING = 5 * MINUTE
export const FEATURE_FLAG_EXPIRATION = 2 * MINUTE
