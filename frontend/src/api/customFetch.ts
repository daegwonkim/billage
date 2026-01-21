import { ApiError, type ProblemDetail } from './error'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL!

// 토큰 재발급 중복 요청 방지
let isRefreshing = false
let refreshPromise: Promise<boolean> | null = null

async function tryReissueToken(): Promise<boolean> {
  // 이미 재발급 중이면 기존 Promise 재사용
  if (isRefreshing && refreshPromise) {
    return refreshPromise
  }

  isRefreshing = true
  refreshPromise = (async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/tokens/reissue`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      })
      return response.ok
    } catch {
      return false
    } finally {
      isRefreshing = false
      refreshPromise = null
    }
  })()

  return refreshPromise
}

export async function customFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const doFetch = async () => {
    const response = await fetch(API_BASE_URL + path, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      },
      credentials: 'include'
    })
    return response
  }

  let response = await doFetch()

  // 401 Unauthorized면 토큰 재발급 시도 후 재요청
  if (response.status === 401 && !path.includes('/api/auth/tokens/reissue')) {
    const reissued = await tryReissueToken()
    if (reissued) {
      response = await doFetch()
    }
  }

  if (!response.ok) {
    const contentType = response.headers.get('content-type')

    if (contentType?.includes('application/problem+json')) {
      const problem: ProblemDetail = await response.json()
      throw new ApiError(problem)
    }

    // ProblemDetail이 아닌 경우 기본 에러
    throw new ApiError({
      status: response.status,
      title: response.statusText
    })
  }

  const text = await response.text()
  if (!text) {
    return undefined as T
  }
  return JSON.parse(text)
}
