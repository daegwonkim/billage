package io.github.daegwonkim.backend.controller

import io.github.daegwonkim.backend.dto.auth.CheckRegistrationRequest
import io.github.daegwonkim.backend.dto.auth.CheckRegistrationResponse
import io.github.daegwonkim.backend.dto.auth.SignInRequest
import io.github.daegwonkim.backend.dto.auth.SignUpRequest
import io.github.daegwonkim.backend.dto.auth.ConfirmVerificationCodeRequest
import io.github.daegwonkim.backend.dto.auth.ConfirmVerificationCodeResponse
import io.github.daegwonkim.backend.dto.auth.SendVerificationCodeRequest
import io.github.daegwonkim.backend.dto.auth.SignInResponse
import io.github.daegwonkim.backend.exception.errorcode.AuthErrorCode
import io.github.daegwonkim.backend.exception.business.AuthenticationException
import io.github.daegwonkim.backend.aop.annotation.SmsRateLimit
import io.github.daegwonkim.backend.service.AuthService
import io.github.daegwonkim.backend.util.CookieUtil
import io.swagger.v3.oas.annotations.Operation
import jakarta.servlet.http.HttpServletRequest
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
    @SmsRateLimit(phoneNo = "#request.phoneNo")
    @Operation(summary = "인증코드 전송", description = "사용자에게 인증코드를 전송합니다")
    @PostMapping("/verification-code")
    fun sendVerificationCode(@Valid @RequestBody request: SendVerificationCodeRequest) =
        authService.sendVerificationCode(request)

    @Operation(summary = "인증코드 검증", description = "사용자가 입력한 인증코드를 검증합니다")
    @PostMapping("/verification-code/confirm")
    fun confirmVerificationCode(
        @Valid @RequestBody request: ConfirmVerificationCodeRequest
    ): ConfirmVerificationCodeResponse =
        authService.confirmVerificationCode(request)

    @Operation(summary = "회원 여부 확인", description = "이미 등록된 사용자인지 확인합니다")
    @PostMapping("/registration-check")
    fun checkRegistration(
        @Valid @RequestBody request: CheckRegistrationRequest
    ): CheckRegistrationResponse = authService.checkRegistration(request)

    @Operation(summary = "회원가입", description = "새로운 계정을 등록합니다")
    @PostMapping("/sign-up")
    fun signUp(@Valid @RequestBody request: SignUpRequest) =
        authService.signUp(request)

    @Operation(summary = "로그인", description = "기존 계정으로 로그인합니다")
    @PostMapping("/sign-in")
    fun signIn(@Valid @RequestBody request: SignInRequest, response: HttpServletResponse): SignInResponse {
        val signInResult = authService.signIn(request)
        response.addCookie(cookieUtil.createAccessTokenCookie(signInResult.accessToken))
        response.addCookie(cookieUtil.createRefreshTokenCookie(signInResult.refreshToken))

        return SignInResponse(signInResult.userId)
    }

    @Operation(summary = "토큰 재발급", description = "AccessToken, RefreshToken을 재발급합니다")
    @PostMapping("/tokens/reissue")
    fun reissueToken(request: HttpServletRequest, response: HttpServletResponse) {
        val refreshToken = cookieUtil.getTokenFromCookie(request, "refreshToken")
            ?: throw AuthenticationException(AuthErrorCode.AUTHENTICATION_FAILED, "세션 만료")

        val reissueTokenResponse = authService.reissueToken(refreshToken)
        response.addCookie(cookieUtil.createAccessTokenCookie(reissueTokenResponse.accessToken))
        response.addCookie(cookieUtil.createRefreshTokenCookie(reissueTokenResponse.refreshToken))
    }

    @Operation(summary = "로그아웃", description = "로그아웃하고 토큰을 무효화합니다")
    @PostMapping("/sign-out")
    fun signOut(
        request: HttpServletRequest,
        response: HttpServletResponse
    ) {
        val refreshToken = cookieUtil.getTokenFromCookie(request, "refreshToken")
        refreshToken?.let { authService.signOut(it) }

        response.addCookie(cookieUtil.deleteCookie("accessToken"))
        response.addCookie(cookieUtil.deleteCookie("refreshToken"))
    }
}