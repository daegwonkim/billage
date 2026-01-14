import type { SignInRequest } from './dto/SignIn'
import type { SignUpRequest } from './dto/SignUp'
import type {
  ConfirmVerificationCodeRequest,
  ConfirmVerificationCodeResponse
} from './dto/ConfirmVerificationCode'
import type { SendVerificationCodeRequest } from './dto/SendVerificationCode'
import { ApiError, type ProblemDetail } from '../error'
import type {
  ConfirmMemberRequest,
  ConfirmMemberResponse
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

export async function confirmMember(
  request: ConfirmMemberRequest
): Promise<ConfirmMemberResponse> {
  const response = await fetch(`${API_BASE_URL}/api/auth/confirm-member`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(request)
  })
  if (!response.ok) throw new Error('Failed to confirm member')

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
    method: 'POST'
  })

  if (!response.ok) throw new Error('Failed to sign out')
}
