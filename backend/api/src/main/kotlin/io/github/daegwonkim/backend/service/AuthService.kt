package io.github.daegwonkim.backend.service

import io.github.daegwonkim.backend.coolsms.CoolsmsService
import io.github.daegwonkim.backend.dto.auth.ReissueTokenResponse
import io.github.daegwonkim.backend.dto.auth.ReissueTokenRequest
import io.github.daegwonkim.backend.dto.auth.SignInRequest
import io.github.daegwonkim.backend.dto.auth.SignInResponse
import io.github.daegwonkim.backend.dto.auth.SignUpRequest
import io.github.daegwonkim.backend.dto.auth.SignUpResponse
import io.github.daegwonkim.backend.dto.auth.ConfirmVerificationCodeRequest
import io.github.daegwonkim.backend.dto.auth.ConfirmVerificationCodeResponse
import io.github.daegwonkim.backend.dto.auth.SendVerificationCodeRequest
import io.github.daegwonkim.backend.entity.User
import io.github.daegwonkim.backend.exception.business.AuthenticationException
import io.github.daegwonkim.backend.exception.infra.ExternalApiException
import io.github.daegwonkim.backend.jwt.JwtTokenProvider
import io.github.daegwonkim.backend.redis.RefreshTokenRedisRepository
import io.github.daegwonkim.backend.redis.VerificationCodeRedisRepository
import io.github.daegwonkim.backend.redis.VerifiedTokenRedisRepository
import io.github.daegwonkim.backend.redis.event.dto.RefreshTokenDeleteEvent
import io.github.daegwonkim.backend.redis.event.dto.RefreshTokenSaveEvent
import io.github.daegwonkim.backend.redis.event.dto.VerifiedTokenDeleteEvent
import io.github.daegwonkim.backend.repository.UserRepository
import io.github.daegwonkim.backend.util.NicknameGenerator
import io.github.daegwonkim.backend.vo.GeneratedTokens
import io.github.daegwonkim.backend.vo.Neighborhood
import org.springframework.context.ApplicationEventPublisher
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.security.SecureRandom
import java.util.UUID

@Service
class AuthService(
    private val neighborhoodService: NeighborhoodService,

    private val refreshTokenRedisRepository: RefreshTokenRedisRepository,
    private val verifiedTokenRedisRepository: VerifiedTokenRedisRepository,
    private val verificationCodeRedisRepository: VerificationCodeRedisRepository,

    private val userRepository: UserRepository,

    private val coolsmsService: CoolsmsService,
    private val jwtTokenProvider: JwtTokenProvider,
    private val eventPublisher: ApplicationEventPublisher,
    private val nicknameGenerator: NicknameGenerator,
) {

    companion object {
        private const val VERIFICATION_CODE_LENGTH = 6
    }

    fun sendVerificationCode(request: SendVerificationCodeRequest) {
        val phoneNo = request.phoneNo

        val generatedVerificationCode = generateVerificationCodeAndSave(phoneNo)
        buildVerificationCodeMessageAndSendSms(phoneNo, generatedVerificationCode)
    }

    fun confirmVerificationCode(request: ConfirmVerificationCodeRequest): ConfirmVerificationCodeResponse {
        val phoneNo = request.phoneNo
        val verificationCode = request.verificationCode

        validateVerificationCode(phoneNo, verificationCode)
        val verifiedToken = generateVerifiedTokenAndSave(phoneNo)
        verificationCodeRedisRepository.delete(phoneNo)

        val exists = userRepository.existsByPhoneNoAndIsWithdrawnFalse(phoneNo)

        return ConfirmVerificationCodeResponse(verifiedToken, exists)
    }

    @Transactional
    fun signUp(request: SignUpRequest): SignUpResponse {
        val phoneNo = request.phoneNo
        val verifiedToken = request.verifiedToken
        val latitude = request.neighborhood.latitude
        val longitude = request.neighborhood.longitude
        val code = request.neighborhood.code

        validateVerifiedToken(phoneNo, verifiedToken)

        val neighborhood = Neighborhood(latitude, longitude, code)
        neighborhoodService.validateNeighborhood(neighborhood)

        val userId = saveUser(phoneNo)
        neighborhoodService.saveNeighborhood(userId, neighborhood)

        val generatedTokens = generateTokensAndSaveRefreshToken(userId)
        eventPublisher.publishEvent(VerifiedTokenDeleteEvent(phoneNo))

        return SignUpResponse(generatedTokens.accessToken, generatedTokens.refreshToken)
    }

    @Transactional(readOnly = true)
    fun signIn(request: SignInRequest): SignInResponse {
        val phoneNo = request.phoneNo

        val user = userRepository.findByPhoneNoAndIsWithdrawnFalse(phoneNo)
            ?: throw AuthenticationException(AuthenticationException.Reason.USER_NOT_FOUND)

        validateVerifiedToken(phoneNo, request.verifiedToken)

        val generatedTokens = generateTokensAndSaveRefreshToken(user.id)
        eventPublisher.publishEvent(VerifiedTokenDeleteEvent(phoneNo))

        return SignInResponse(generatedTokens.accessToken, generatedTokens.refreshToken)
    }

    @Transactional(readOnly = true)
    fun reissueToken(request: ReissueTokenRequest): ReissueTokenResponse {
        val userId = jwtTokenProvider.validateAndGetUserId(request.refreshToken)

        userRepository.findByIdOrNull(userId)
            ?: throw AuthenticationException(AuthenticationException.Reason.USER_NOT_FOUND)

        validateRefreshToken(userId, request.refreshToken)

        val generatedTokens = generateTokensAndSaveRefreshToken(userId)
        eventPublisher.publishEvent(RefreshTokenDeleteEvent(userId))

        return ReissueTokenResponse(generatedTokens.accessToken, generatedTokens.refreshToken)
    }

    fun signOut(token: String) {
        jwtTokenProvider.validateAndGetUserIdOrNull(token)?.let { userId ->
            refreshTokenRedisRepository.delete(userId)
        }
    }

    // Private helper methods

    fun generateVerificationCodeAndSave(phoneNo: String): String {
        val verificationCode = generateVerificationCode()
        verificationCodeRedisRepository.save(phoneNo, verificationCode)
        return verificationCode
    }

    fun buildVerificationCodeMessageAndSendSms(phoneNo: String, verificationCode: String) {
        val message = buildVerificationCodeMessage(verificationCode)
        requestSendSms(phoneNo, message)
    }

    private fun requestSendSms(phoneNo: String, message: String) {
        try {
            coolsmsService.sendSms(phoneNo, message)
        } catch (e: ExternalApiException) {
            verificationCodeRedisRepository.delete(phoneNo)
            throw e
        }
    }

    private fun generateVerifiedTokenAndSave(phoneNo: String): UUID {
        val verifiedToken = UUID.randomUUID()
        verifiedTokenRedisRepository.save(phoneNo, verifiedToken)
        return verifiedToken
    }

    private fun validateVerificationCode(phoneNo: String, requestedVerificationCode: String) {
        val savedVerificationCode = verificationCodeRedisRepository.find(phoneNo)

        if (savedVerificationCode == null || savedVerificationCode != requestedVerificationCode) {
            throw AuthenticationException(AuthenticationException.Reason.INVALID_VERIFICATION_CODE)
        }
    }

    private fun validateVerifiedToken(phoneNo: String, requestedVerifiedToken: String) {
        val savedToken = verifiedTokenRedisRepository.find(phoneNo)

        if (savedToken == null || savedToken != requestedVerifiedToken) {
            throw AuthenticationException(AuthenticationException.Reason.INVALID_VERIFIED_TOKEN)
        }
    }

    private fun saveUser(phoneNo: String): Long {
        val user = userRepository.save(
            User(phoneNo = phoneNo, nickname = nicknameGenerator.generate())
        )
        return user.id
    }

    private fun generateTokensAndSaveRefreshToken(userId: Long): GeneratedTokens {
        val accessToken = jwtTokenProvider.generateAccessToken(userId)
        val refreshToken = jwtTokenProvider.generateRefreshToken(userId)

        eventPublisher.publishEvent(RefreshTokenSaveEvent(userId, refreshToken))
        return GeneratedTokens(accessToken, refreshToken)
    }

    private fun validateRefreshToken(userId: Long, requestedRefreshToken: String) {
        val savedRefreshToken = refreshTokenRedisRepository.find(userId)

        if (savedRefreshToken == null || savedRefreshToken != requestedRefreshToken) {
            throw AuthenticationException(AuthenticationException.Reason.INVALID_REFRESH_TOKEN)
        }
    }

    private fun buildVerificationCodeMessage(verificationCode: String): String =
        "[빌리지] 인증번호는 [$verificationCode] 입니다.\n*절대 타인에게 노출하지 마세요.*"

    private fun generateVerificationCode(): String =
        SecureRandom().nextInt(10.pow(VERIFICATION_CODE_LENGTH))
            .let { "%0${VERIFICATION_CODE_LENGTH}d".format(it) }

    private fun Int.pow(exponent: Int): Int =
        (1..exponent).fold(1) { acc, _ -> acc * this }
}