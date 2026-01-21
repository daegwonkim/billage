package io.github.daegwonkim.backend.dto.auth

import io.github.daegwonkim.backend.validator.annotation.ValidPhoneNo
import jakarta.validation.constraints.NotBlank

data class CheckRegistrationRequest(
    @field:NotBlank(message = "휴대폰 번호는 필수입니다")
    @field:ValidPhoneNo
    val phoneNo: String,
)

data class CheckRegistrationResponse(
    val registered: Boolean
)
