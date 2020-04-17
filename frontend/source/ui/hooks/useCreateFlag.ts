import { useEffect, useState } from 'react'

export function useCreateFlag() {
  const [featureFlagName, setFeatureFlagName] = useState('')
  const [creatingFeatureFlag, setCreatingFeatureFlag] = useState(false)

  useEffect(() => {
    if (!creatingFeatureFlag) {
      setFeatureFlagName('')
    }
  }, [creatingFeatureFlag])

  return {
    creatingFeatureFlag,
    setCreatingFeatureFlag,
    featureFlagName,
    setFeatureFlagName: (name: string) => setFeatureFlagName(ensureValidFlagName(name)),
  } as const
}

function ensureValidFlagName(name: string): string {
  return name.toLowerCase().replace(/\s/g, '-')
}
