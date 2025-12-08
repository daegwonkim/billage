package io.github.daegwonkim.backend.dto

import io.github.daegwonkim.backend.common.validator.annotation.ValidPhoneNo
import io.github.daegwonkim.backend.common.validator.annotation.ValidVerifiedToken
import jakarta.validation.constraints.NotBlank

data class SignUpRequest(
    @field:NotBlank(message = "휴대폰 번호는 필수입니다")
    @field:ValidPhoneNo
    val phoneNo: String,

    @field:NotBlank(message = "인증토큰은 필수입니다")
    @field:ValidVerifiedToken
    val verifiedToken: String,

    val neighborhood: Neighborhood
) {
    data class Neighborhood(
        @field:NotBlank(message = "위도는 필수입니다")
        val latitude: Double,

        @field:NotBlank(message = "경도는 필수입니다")
        val longitude: Double,

        @field:NotBlank(message = "법정동코드는 필수입니다")
        val code: String
    )
}