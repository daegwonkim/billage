import type {
  ConfirmPhoneNoRequest,
  ConfirmPhoneNoResponse
} from './dto/ConfirmPhoneNo'
import type { SignInRequest } from './dto/SignIn'
import type { SignUpRequest } from './dto/SignUp'
import type {
  ConfirmVerificationCodeRequest,
  ConfirmVerificationCodeResponse
} from './dto/ConfirmVerificationCode'
import type { SendVerificationCodeRequest } from './dto/SendVerificationCode'
import { ApiError, type ApiErrorResponse } from '../error'

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
    const errorData: ApiErrorResponse = await response.json()
    throw new ApiError(
      errorData.code,
      errorData.message,
      response.status,
      errorData.path,
      errorData.errors
    )
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

export async function signUp(request: SignUpRequest): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/auth/sign-up`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(request)
  })
  if (!response.ok) {
    const errorData: ApiErrorResponse = await response.json()
    throw new ApiError(
      errorData.code,
      errorData.message,
      response.status,
      errorData.path,
      errorData.errors
    )
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

export async function confirmPhoneNo(
  request: ConfirmPhoneNoRequest
): Promise<ConfirmPhoneNoResponse> {
  const response = await fetch(`${API_BASE_URL}/api/auth/phone-no/confirm`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(request)
  })
  if (!response.ok) throw new Error('Failed to verify phone no')

  return response.json()
}

export async function confirmNeighborhood(
  phoneNo: string,
  verificationCode: string
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/api/auth/neighborhood/confirm`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ phoneNo, verificationCode })
    }
  )
  if (!response.ok) throw new Error('Failed to verify verification code')
}
