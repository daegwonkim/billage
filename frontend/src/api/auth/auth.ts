import type { SignInRequest, SignInResponse } from './dto/SignIn'
import type { SignUpRequest } from './dto/SignUp'
import type {
  ConfirmVerificationCodeRequest,
  ConfirmVerificationCodeResponse
} from './dto/ConfirmVerificationCode'
import type { SendVerificationCodeRequest } from './dto/SendVerificationCode'
import type {
  CheckRegistrationRequest,
  CheckRegistrationResponse
} from './dto/CheckRegistration'
import { customFetch } from '../customFetch'

export async function sendVerificationCode(
  request: SendVerificationCodeRequest
): Promise<void> {
  await customFetch(`/api/auth/verification-code`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(request)
  })
}

export async function confirmVerificationCode(
  request: ConfirmVerificationCodeRequest
): Promise<ConfirmVerificationCodeResponse> {
  const response = await customFetch<ConfirmVerificationCodeResponse>(
    `/api/auth/verification-code/confirm`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request)
    }
  )

  return response
}

export async function checkRegistration(
  request: CheckRegistrationRequest
): Promise<CheckRegistrationResponse> {
  const response = await customFetch<CheckRegistrationResponse>(
    `/api/auth/registration-check`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request)
    }
  )

  return response
}

export async function signUp(request: SignUpRequest): Promise<void> {
  await customFetch(`/api/auth/sign-up`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(request)
  })
}

export async function signIn(request: SignInRequest): Promise<SignInResponse> {
  return await customFetch<SignInResponse>(`/api/auth/sign-in`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(request)
  })
}

export async function signOut(): Promise<void> {
  await customFetch(`/api/auth/sign-out`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export async function withdraw(): Promise<void> {
  await customFetch(`/api/auth/withdraw`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
