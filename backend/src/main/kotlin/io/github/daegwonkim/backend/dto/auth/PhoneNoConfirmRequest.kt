package io.github.daegwonkim.backend.dto.auth

import io.github.daegwonkim.backend.common.validator.annotation.ValidPhoneNo
import jakarta.validation.constraints.NotBlank

data class PhoneNoConfirmRequest(
    @field:NotBlank(message = "휴대폰 번호는 필수입니다")
    @field:ValidPhoneNo
    val phoneNo: String
)
