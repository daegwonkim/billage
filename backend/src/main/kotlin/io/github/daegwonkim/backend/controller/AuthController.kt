package io.github.daegwonkim.backend.controller

import io.github.daegwonkim.backend.dto.auth.PhoneNoConfirmRequest
import io.github.daegwonkim.backend.dto.auth.TokenReissueRequest
import io.github.daegwonkim.backend.dto.auth.SignInRequest
import io.github.daegwonkim.backend.dto.auth.SignUpRequest
import io.github.daegwonkim.backend.dto.auth.VerificationCodeConfirmRequest
import io.github.daegwonkim.backend.dto.auth.VerificationCodeConfirmResponse
import io.github.daegwonkim.backend.dto.auth.VerificationCodeSendRequest
import io.github.daegwonkim.backend.service.AuthService
import io.github.daegwonkim.backend.util.CookieUtil
import io.swagger.v3.oas.annotations.Operation
import jakarta.servlet.http.HttpServletResponse
import jakarta.validation.Valid
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/auth")
class AuthController(
    private val authService: AuthService,
    private val cookieUtil: CookieUtil
) {
    @Operation(summary = "인증번호 전송", description = "사용자에게 인증번호를 전송합니다")
    @PostMapping("/verification-code/send")
    fun sendVerificationCode(@Valid @RequestBody request: VerificationCodeSendRequest) =
        authService.sendVerificationCode(request)

    @Operation(summary = "인증번호 검증", description = "사용자가 입력한 인증번호를 검증합니다")
    @PostMapping("/verification-code/confirm")
    fun confirmVerificationCode(
        @Valid @RequestBody request: VerificationCodeConfirmRequest
    ): VerificationCodeConfirmResponse =
        authService.confirmVerificationCode(request)

    @Operation(summary = "휴대폰 번호 검증", description = "서버에 존재하는 휴대폰 번호인지 검증합니다")
    @PostMapping("/phone-no/confirm")
    fun confirmPhoneNo(@Valid @RequestBody request: PhoneNoConfirmRequest) =
        authService.confirmPhoneNo(request)

    @Operation(summary = "회원가입", description = "새로운 계정을 등록합니다")
    @PostMapping("/sign-up")
    fun signUp(@Valid @RequestBody request: SignUpRequest, response: HttpServletResponse) {
        val signUpResponse = authService.signUp(request)

        response.addCookie(cookieUtil.createAccessTokenCookie(signUpResponse.accessToken))
        response.addCookie(cookieUtil.createRefreshTokenCookie(signUpResponse.refreshToken))
    }

    @Operation(summary = "로그인", description = "기존 계정으로 로그인합니다")
    @PostMapping("/sign-in")
    fun signIn(@Valid @RequestBody request: SignInRequest, response: HttpServletResponse) {
        val signInResponse = authService.signIn(request)

        response.addCookie(cookieUtil.createAccessTokenCookie(signInResponse.accessToken))
        response.addCookie(cookieUtil.createRefreshTokenCookie(signInResponse.refreshToken))
    }

    @Operation(summary = "토큰 재발급", description = "AccessToken, RefreshToken을 재발급합니다")
    @PostMapping("/token/reissue")
    fun reissueToken(request: TokenReissueRequest, response: HttpServletResponse) {
        val reissueTokenResponse = authService.reissueToken(request)

        response.addCookie(cookieUtil.createAccessTokenCookie(reissueTokenResponse.accessToken))
        response.addCookie(cookieUtil.createRefreshTokenCookie(reissueTokenResponse.refreshToken))
    }
}