package io.github.daegwonkim.backend.controller

import io.github.daegwonkim.backend.dto.auth.ConfirmMemberRequest
import io.github.daegwonkim.backend.dto.auth.ConfirmMemberResponse
import io.github.daegwonkim.backend.dto.auth.SignInRequest
import io.github.daegwonkim.backend.dto.auth.SignUpRequest
import io.github.daegwonkim.backend.dto.auth.ConfirmVerificationCodeRequest
import io.github.daegwonkim.backend.dto.auth.ConfirmVerificationCodeResponse
import io.github.daegwonkim.backend.dto.auth.SendVerificationCodeRequest
import io.github.daegwonkim.backend.service.AuthService
import io.github.daegwonkim.backend.util.CookieUtil
import io.swagger.v3.oas.annotations.Operation
import jakarta.servlet.http.HttpServletResponse
import jakarta.validation.Valid
import org.springframework.security.core.annotation.AuthenticationPrincipal
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
    fun sendVerificationCode(@Valid @RequestBody request: SendVerificationCodeRequest) =
        authService.sendVerificationCode(request)

    @Operation(summary = "인증번호 검증", description = "사용자가 입력한 인증번호를 검증합니다")
    @PostMapping("/verification-code/confirm")
    fun confirmVerificationCode(
        @Valid @RequestBody request: ConfirmVerificationCodeRequest
    ): ConfirmVerificationCodeResponse =
        authService.confirmVerificationCode(request)

    @Operation(summary = "회원 여부 확인", description = "사용자가 이미 회원인지 확인합니다")
    @PostMapping("/confirm-member")
    fun confirm(
        @Valid @RequestBody request: ConfirmMemberRequest
    ): ConfirmMemberResponse = authService.confirmMember(request)

    @Operation(summary = "회원가입", description = "새로운 계정을 등록합니다")
    @PostMapping("/sign-up")
    fun signUp(@Valid @RequestBody request: SignUpRequest) =
        authService.signUp(request)

    @Operation(summary = "로그인", description = "기존 계정으로 로그인합니다")
    @PostMapping("/sign-in")
    fun signIn(@Valid @RequestBody request: SignInRequest, response: HttpServletResponse) {
        val signInResponse = authService.signIn(request)

        response.addCookie(cookieUtil.createAccessTokenCookie(signInResponse.accessToken))
    }

    @Operation(summary = "토큰 재발급", description = "AccessToken, RefreshToken을 재발급합니다")
    @PostMapping("/token/reissue")
    fun reissueToken(
        @AuthenticationPrincipal userId: Long,
        response: HttpServletResponse
    ) {
        val reissueTokenResponse = authService.reissueToken(userId)

        response.addCookie(cookieUtil.createAccessTokenCookie(reissueTokenResponse.accessToken))
    }

    @Operation(summary = "로그아웃", description = "로그아웃하고 토큰을 무효화합니다")
    @PostMapping("/sign-out")
    fun signOut(
        @AuthenticationPrincipal userId: Long,
        response: HttpServletResponse
    ) {
        authService.signOut(userId)

        response.addCookie(cookieUtil.deleteCookie("accessToken"))
    }
}