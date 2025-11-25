import { useState, useEffect } from 'react'

interface UseFetchOptions {
  skip?: boolean // 조건부 fetch
}

interface UseFetchResult<T> {
  data: T | null
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useFetch<T>(
  fetchFn: () => Promise<T>,
  options: UseFetchOptions = {}
): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [refetchTrigger, setRefetchTrigger] = useState(0)

  const { skip = false } = options

  useEffect(() => {
    if (skip) return

    let cancelled = false

    async function fetch() {
      try {
        setLoading(true)
        setError(null)
        const result = await fetchFn()

        if (!cancelled) {
          setData(result)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'An error occurred')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetch()

    return () => {
      cancelled = true
    }
  }, [refetchTrigger, skip])

  const refetch = () => setRefetchTrigger(prev => prev + 1)

  return { data, loading, error, refetch }
}
