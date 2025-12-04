package io.github.daegwonkim.backend.controller

import io.github.daegwonkim.backend.dto.PhoneNoConfirmRequest
import io.github.daegwonkim.backend.dto.VerificationCodeConfirmRequest
import io.github.daegwonkim.backend.dto.VerificationCodeConfirmResponse
import io.github.daegwonkim.backend.dto.VerificationCodeSendRequest
import io.github.daegwonkim.backend.service.AuthService
import io.swagger.v3.oas.annotations.Operation
import jakarta.validation.Valid
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/auth")
class AuthController(
    private val authService: AuthService
) {
    @Operation(summary = "인증번호 전송", description = "사용자에게 인증번호를 전송합니다.")
    @PostMapping("/verification-code/send")
    fun sendVerificationCode(@Valid @RequestBody request: VerificationCodeSendRequest) =
        authService.sendVerificationCode(request)

    @Operation(summary = "인증번호 검증", description = "사용자가 입력한 인증번호를 검증합니다.")
    @PostMapping("/verification-code/confirm")
    fun confirmVerificationCode(
        @Valid @RequestBody request: VerificationCodeConfirmRequest
    ): VerificationCodeConfirmResponse =
        authService.confirmVerificationCode(request)
            .let(::VerificationCodeConfirmResponse)

    @Operation(summary = "휴대폰 번호 검증", description = "서버에 존재하는 휴대폰 번호인지 검증합니다.")
    @PostMapping("/phone-no/confirm")
    fun confirmPhoneNo(@Valid @RequestBody request: PhoneNoConfirmRequest) =
        authService.confirmPhoneNo(request)
}