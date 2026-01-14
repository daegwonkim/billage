import type { SignInRequest } from './dto/SignIn'
import type { SignUpRequest } from './dto/SignUp'
import type {
  ConfirmVerificationCodeRequest,
  ConfirmVerificationCodeResponse
} from './dto/ConfirmVerificationCode'
import type { SendVerificationCodeRequest } from './dto/SendVerificationCode'
import { ApiError, type ProblemDetail } from '../error'
import type {
  ConfirmRegisteredRequest,
  ConfirmRegisteredResponse
} from './dto/ConfirmMember'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL!

export async function sendVerificationCode(
  request: SendVerificationCodeRequest
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/api/auth/verification-code/send`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request)
    }
  )
  if (!response.ok) {
    const errorData: ProblemDetail = await response.json()
    throw ApiError.fromResponse(errorData, response.status)
  }
}

export async function confirmVerificationCode(
  request: ConfirmVerificationCodeRequest
): Promise<ConfirmVerificationCodeResponse> {
  const response = await fetch(
    `${API_BASE_URL}/api/auth/verification-code/confirm`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request)
    }
  )
  if (!response.ok) throw new Error('Failed to verify verification code')

  return response.json()
}

export async function confirmRegistered(
  request: ConfirmRegisteredRequest
): Promise<ConfirmRegisteredResponse> {
  const response = await fetch(`${API_BASE_URL}/api/auth/confirm-registered`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(request)
  })
  if (!response.ok) throw new Error('Failed to confirm registered')

  return response.json()
}

export async function signUp(request: SignUpRequest): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/auth/sign-up`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(request)
  })
  if (!response.ok) {
    const errorData: ProblemDetail = await response.json()
    throw ApiError.fromResponse(errorData, response.status)
  }
}

export async function signIn(request: SignInRequest): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/auth/sign-in`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify(request)
  })
  if (!response.ok) throw new Error('Failed to sign in')
}

export async function reissue() {
  const response = await fetch(`${API_BASE_URL}/api/auth/token/reissue`, {
    method: 'POST'
  })

  if (!response.ok) throw new Error('Failed to reissue')
}

export async function signOut() {
  const response = await fetch(`${API_BASE_URL}/api/auth/sign-out`, {
    method: 'POST',
    credentials: 'include'
  })

  if (!response.ok) throw new Error('Failed to sign out')
}
