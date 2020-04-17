import { pathJoin } from '@typed/history'
import { isDevelopment } from './environment'

export function createUrl(domain: string, path: string): string {
  const protocol = isDevelopment ? 'http://' : 'https://'
  const url = pathJoin([domain, path], true)

  return protocol + url
}
