import {
  addHeader,
  createHttpEnv,
  HttpEnv,
  withHttpManagement,
  WithHttpManagementOptions,
} from '@typed/http'
import { useMemo, useState } from 'react'
import { createContextFromHook } from './createContextFromHook'

// tslint:disable-next-line:variable-name
const [HttpEnvProvider, useHttpEnvContext, HttpEnvContext] = createContextFromHook(
  __useHttp,
  'HttpEnv',
)

export { HttpEnvProvider, HttpEnvContext }

// Allow consumer to define their own options and headers
export const useHttpEnv = (options?: WithHttpManagementOptions) => {
  const { httpEnv, headers, addHttpHeader, removeHttpHeader } = useHttpEnvContext()
  const cachedEnv = useMemo(() => (options ? withHttpManagement(options, httpEnv) : httpEnv), [
    httpEnv,
    JSON.stringify(options),
  ])
  const envWithHeaders = useMemo(() => addAllHeaders(cachedEnv, headers), [
    cachedEnv,
    JSON.stringify(headers),
  ])

  return {
    httpEnv: envWithHeaders,
    headers,
    addHttpHeader,
    removeHttpHeader,
  } as const
}

function __useHttp(initialHttpEnv: HttpEnv = createHttpEnv()) {
  const [headers, setHeaders] = useState<Record<string, string>>({})
  const httpEnv = addAllHeaders(initialHttpEnv, headers)
  const addHttpHeader = (header: string, value: string) => {
    headers[header] = value
    setHeaders(headers)
  }
  const removeHttpHeader = (header: string) => {
    delete headers[header]
    setHeaders(headers)
  }

  return {
    httpEnv,
    headers,
    addHttpHeader,
    removeHttpHeader,
  } as const
}

function addAllHeaders(initialHttpEnv: HttpEnv, headers: Record<string, string>): HttpEnv {
  let env = initialHttpEnv

  for (const key in headers) {
    if (Object.prototype.hasOwnProperty.call(headers, key)) {
      env = addHeader(key, headers[key], env)
    }
  }

  return env
}
