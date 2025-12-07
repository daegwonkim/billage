// const API_BASE_URL = 'https://billage.onrender.com'
const API_BASE_URL = 'http://localhost:8080'

interface FetchOptions extends RequestInit {
  params?: Record<string, string>
}

async function fetchWithToken(endpoint: string, options: FetchOptions = {}) {
  const { params, ...fetchOptions } = options

  let url = `${API_BASE_URL}${endpoint}`
  if (params) {
    const searchParams = new URLSearchParams(params)
    url += `?${searchParams.toString()}`
  }

  const config: RequestInit = {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...fetchOptions.headers
    },
    ...fetchOptions
  }

  const response = await fetch(url, config)

  // 401 에러 처리 (토큰 만료)
  if (response.status === 401) {
    const reissueReponse = await reissueToken()

    if (reissueReponse.ok) {
      return fetch(url, config)
    } else {
      window.location.href = '/login'
      throw new Error('Authentication failed')
    }
  }

  return response
}

async function reissueToken(): Promise<Response> {
  const response = await fetch(`${API_BASE_URL}/api/auth/token/reissue`, {
    method: 'POST',
    credentials: 'include'
  })
  return response
}

export default fetchWithToken
