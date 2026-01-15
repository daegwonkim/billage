import { ApiError, type ProblemDetail } from './error'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL!

export async function customFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(API_BASE_URL + path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers
    },
    credentials: 'include'
  })

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
