const API_BASE_URL = 'https://billage.onrender.com'

export async function signup(phoneNumber: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ phoneNumber })
  })
  if (!response.ok) throw new Error('Failed to signup')
}

export async function signin(phoneNumber: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/auth/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ phoneNumber })
  })
  if (!response.ok) throw new Error('Failed to signin')
}

export async function verifyIdentity(
  name: string,
  birth: string,
  gender: number,
  carrier: string,
  phoneNumber: string
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/auth/identity/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, birth, gender, carrier, phoneNumber })
  })
  if (!response.ok) throw new Error('Failed to verify identity')
}

export async function verifyPhoneNumber(phoneNumber: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/auth/phone-number/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ phoneNumber })
  })
  if (!response.ok) throw new Error('Failed to verify phone number')
}

export async function sendVerificationCode(phoneNumber: string): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/api/auth/verification-code/send`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ phoneNumber })
    }
  )
  if (!response.ok) throw new Error('Failed to send verification code')
}

export async function verifyVerificationCode(
  phoneNumber: string,
  verificationCode: string
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/api/auth/verification-code/verify`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ phoneNumber, verificationCode })
    }
  )
  if (!response.ok) throw new Error('Failed to verify verification code')
}

export async function verifyNeighborhood(
  phoneNumber: string,
  verificationCode: string
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/auth/neighborhood/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ phoneNumber, verificationCode })
  })
  if (!response.ok) throw new Error('Failed to verify verification code')
}
