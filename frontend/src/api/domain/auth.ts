import type {
  PhoneNoConfirmRequest,
  PhoneNoConfirmResponse
} from '../dto/PhoneNoConfirm'
import type { SignInRequest } from '../dto/SignIn'
import type { SignUpRequest } from '../dto/SignUp'
import type {
  VerificationCodeConfirmRequest,
  VerificationCodeConfirmResponse
} from '../dto/VerificationCodeConfirm'
import type { VerificationCodeSendRequest } from '../dto/VerificationCodeSend'
import { ApiError, type ApiErrorResponse } from './error'

// const API_BASE_URL = 'https://billage.onrender.com'
const API_BASE_URL = 'http://localhost:8080'

export async function sendVerificationCode(
  request: VerificationCodeSendRequest
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
  request: VerificationCodeConfirmRequest
): Promise<VerificationCodeConfirmResponse> {
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
  request: PhoneNoConfirmRequest
): Promise<PhoneNoConfirmResponse> {
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
