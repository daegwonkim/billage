import type { SignInRequest } from './dto/SignIn'
import type { SignUpRequest } from './dto/SignUp'
import type {
  ConfirmVerificationCodeRequest,
  ConfirmVerificationCodeResponse
} from './dto/ConfirmVerificationCode'
import type { SendVerificationCodeRequest } from './dto/SendVerificationCode'
import type {
  ConfirmRegisteredRequest,
  ConfirmRegisteredResponse
} from './dto/ConfirmMember'
import { customFetch } from '../fetch'

export async function sendVerificationCode(
  request: SendVerificationCodeRequest
): Promise<void> {
  await customFetch(`/api/auth/verification-code/send`, {
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

export async function confirmRegistered(
  request: ConfirmRegisteredRequest
): Promise<ConfirmRegisteredResponse> {
  const response = await customFetch<ConfirmRegisteredResponse>(
    `/api/auth/confirm-registered`,
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

export async function signIn(request: SignInRequest): Promise<void> {
  await customFetch(`/api/auth/sign-in`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(request)
  })
}

export async function reissue(): Promise<void> {
  await customFetch(`/api/auth/token/reissue`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
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
