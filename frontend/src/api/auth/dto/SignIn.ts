export interface SignInRequest {
  phoneNo: string
  verifiedToken: string
}

export interface SignInResponse {
  userId: number
}
