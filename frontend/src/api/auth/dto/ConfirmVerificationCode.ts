export interface ConfirmVerificationCodeRequest {
  phoneNo: string
  verificationCode: string
}

export interface ConfirmVerificationCodeResponse {
  phoneNo: string
  verifiedToken: string
}
