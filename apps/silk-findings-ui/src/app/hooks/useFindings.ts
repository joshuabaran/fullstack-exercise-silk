import { useEffect, useState, useRef } from 'react'

import { IFinding } from '@silk-libs/finding-types'

const useFindings = () => {
  const baseURL = process.env.NX_FINDINGS_API_BASE_URI
  const [data, setData] = useState<IFinding[] | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  // <StrictMode> dev useEffect workaround. prevents fetch from running twice in dev env
  const isMountedRef = useRef(false)

  useEffect(() => {
    if(!isMountedRef.current) {
      isMountedRef.current = true
      baseURL && fetch(`${baseURL}/api/findings`)
      .then((response) => response.json())
      .then((data) => {
          setData(data)
          setLoading(false)
      }).catch((error) => {
          setError(error)
          setLoading(false)
          console.error(error)
      })
    }
  }, [baseURL])

  return { data, loading, error }
}

export default useFindings
