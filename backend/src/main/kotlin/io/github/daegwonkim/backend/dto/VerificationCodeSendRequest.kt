package io.github.daegwonkim.backend.dto

import io.github.daegwonkim.backend.common.validator.annotation.ValidPhoneNo
import jakarta.validation.constraints.NotBlank

data class VerificationCodeSendRequest(
    @field:NotBlank(message = "휴대폰 번호는 필수입니다")
    @field:ValidPhoneNo
    val phoneNo: String
)
