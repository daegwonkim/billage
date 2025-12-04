package io.github.daegwonkim.backend_kotlin.dto

import io.github.daegwonkim.backend_kotlin.common.validator.annotation.ValidPhoneNo
import io.github.daegwonkim.backend_kotlin.common.validator.annotation.ValidVerifiedToken
import jakarta.validation.constraints.NotBlank

data class SigninRequest(
    @field:NotBlank(message = "휴대폰 번호는 필수입니다")
    @field:ValidPhoneNo
    val phoneNo: String,

    @field:NotBlank(message = "인증토큰은 필수입니다")
    @field:ValidVerifiedToken
    val verifiedToken: String
)
