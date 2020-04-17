import { useEffect, useMemo, useState } from 'react'
import { useDomEnv } from '../context/DomEnvContext'

const CHANGE_EVENT_TYPE = 'change'

export function useMediaQuery(query: string) {
  const { window } = useDomEnv()
  const mediaQueryList = useMemo(() => window.matchMedia(query), [])
  const [matches, setMatches] = useState(() => mediaQueryList.matches)

  useEffect(() => {
    const listener = () => setMatches(mediaQueryList.matches)

    mediaQueryList.addEventListener(CHANGE_EVENT_TYPE, listener)

    return () => {
      mediaQueryList.removeEventListener(CHANGE_EVENT_TYPE, listener)
    }
  }, [])

  return matches
}
