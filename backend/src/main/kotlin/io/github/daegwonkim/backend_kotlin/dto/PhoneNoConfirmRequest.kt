package io.github.daegwonkim.backend_kotlin.dto

import io.github.daegwonkim.backend_kotlin.common.validator.annotation.ValidPhoneNo
import jakarta.validation.constraints.NotBlank

data class PhoneNoConfirmRequest(
    @field:NotBlank(message = "휴대폰 번호는 필수입니다")
    @field:ValidPhoneNo
    val phoneNo: String
)
