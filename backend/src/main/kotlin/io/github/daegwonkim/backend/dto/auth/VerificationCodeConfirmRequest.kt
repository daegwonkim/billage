package io.github.daegwonkim.backend.dto.auth

import io.github.daegwonkim.backend.common.validator.annotation.ValidPhoneNo
import io.github.daegwonkim.backend.common.validator.annotation.ValidVerificationCode
import jakarta.validation.constraints.NotBlank

data class VerificationCodeConfirmRequest(
    @field:NotBlank(message = "휴대폰 번호는 필수입니다")
    @field:ValidPhoneNo
    val phoneNo: String,

    @field:NotBlank(message = "인증번호는 필수입니다")
    @field:ValidVerificationCode
    val verificationCode: String
)
