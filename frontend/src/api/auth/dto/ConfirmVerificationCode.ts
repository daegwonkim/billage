export interface ConfirmVerificationCodeRequest {
  phoneNo: string
  verificationCode: string
}

export interface ConfirmVerificationCodeResponse {
  verifiedToken: string
  exists: boolean
}
