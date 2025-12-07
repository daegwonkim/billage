export interface VerificationCodeConfirmRequest {
  phoneNo: string
  verificationCode: string
}

export interface VerificationCodeConfirmResponse {
  phoneNo: string
  verifiedToken: string
}
