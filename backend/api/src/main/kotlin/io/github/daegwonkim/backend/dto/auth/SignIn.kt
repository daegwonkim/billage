package io.github.daegwonkim.backend.dto.auth

import io.github.daegwonkim.backend.validator.annotation.ValidPhoneNo
import io.github.daegwonkim.backend.validator.annotation.ValidVerifiedToken
import jakarta.validation.constraints.NotBlank

data class SignInRequest(
    @field:NotBlank(message = "휴대폰 번호는 필수입니다")
    @field:ValidPhoneNo
    val phoneNo: String,

    @field:NotBlank(message = "인증토큰은 필수입니다")
    @field:ValidVerifiedToken
    val verifiedToken: String
)

data class SignInResult(
    val userId: Long,
    val accessToken: String,
    val refreshToken: String
)

data class SignInResponse(
    val userId: Long
)
