package io.github.daegwonkim.backend.service

import io.github.daegwonkim.backend.coolsms.CoolsmsService
import io.github.daegwonkim.backend.dto.auth.ReissueTokenResponse
import io.github.daegwonkim.backend.dto.auth.ConfirmPhoneNoRequest
import io.github.daegwonkim.backend.dto.auth.ReissueTokenRequest
import io.github.daegwonkim.backend.dto.auth.SignInRequest
import io.github.daegwonkim.backend.dto.auth.SignInResponse
import io.github.daegwonkim.backend.dto.auth.SignUpRequest
import io.github.daegwonkim.backend.dto.auth.SignUpResponse
import io.github.daegwonkim.backend.dto.auth.ConfirmVerificationCodeRequest
import io.github.daegwonkim.backend.dto.auth.ConfirmVerificationCodeResponse
import io.github.daegwonkim.backend.dto.auth.SendVerificationCodeRequest
import io.github.daegwonkim.backend.entity.User
import io.github.daegwonkim.backend.dto.auth.ConfirmPhoneNoResponse
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
        val verificationCode = generateVerificationCode()

        verificationCodeRedisRepository.save(request.phoneNo, verificationCode)

        try {
            coolsmsService.sendSms(request.phoneNo, buildVerificationCodeMessage(verificationCode))
        } catch (e: ExternalApiException) {
            verificationCodeRedisRepository.delete(request.phoneNo)
            throw e
        }
    }

    fun confirmVerificationCode(request: ConfirmVerificationCodeRequest): ConfirmVerificationCodeResponse {
        validateVerificationCode(request.phoneNo, request.verificationCode)

        val verifiedToken = UUID.randomUUID().toString()

        verifiedTokenRedisRepository.save(request.phoneNo, verifiedToken)
        verificationCodeRedisRepository.delete(request.phoneNo)

        return ConfirmVerificationCodeResponse(verifiedToken)
    }

    @Transactional(readOnly = true)
    fun confirmPhoneNo(request: ConfirmPhoneNoRequest): ConfirmPhoneNoResponse {
        val exists = userRepository.existsByPhoneNoAndIsWithdrawnFalse(request.phoneNo)
        return ConfirmPhoneNoResponse(exists)
    }

    @Transactional
    fun signUp(request: SignUpRequest): SignUpResponse {
        validateVerifiedToken(request.phoneNo, request.verifiedToken)

        neighborhoodService.validateNeighborhood(
            request.neighborhood.latitude,
            request.neighborhood.longitude,
            request.neighborhood.code
        )

        val user = userRepository.save(
            User(
                phoneNo = request.phoneNo,
                nickname = nicknameGenerator.generate()
            )
        )

        neighborhoodService.saveNeighborhood(
            user.id,
            request.neighborhood.latitude,
            request.neighborhood.longitude,
            request.neighborhood.code
        )

        val accessToken = jwtTokenProvider.generateAccessToken(user.id)
        val refreshToken = jwtTokenProvider.generateRefreshToken(user.id)

        eventPublisher.publishEvent(RefreshTokenSaveEvent(user.id, refreshToken))
        eventPublisher.publishEvent(VerifiedTokenDeleteEvent(request.phoneNo))

        return SignUpResponse(accessToken, refreshToken)
    }

    @Transactional(readOnly = true)
    fun signIn(request: SignInRequest): SignInResponse {
        val user = userRepository.findByPhoneNoAndIsWithdrawnFalse(request.phoneNo)
            ?: throw AuthenticationException(AuthenticationException.Reason.USER_NOT_FOUND)

        validateVerifiedToken(request.phoneNo, request.verifiedToken)

        val accessToken = jwtTokenProvider.generateAccessToken(user.id)
        val refreshToken = jwtTokenProvider.generateRefreshToken(user.id)

        eventPublisher.publishEvent(RefreshTokenSaveEvent(user.id, refreshToken))
        eventPublisher.publishEvent(VerifiedTokenDeleteEvent(request.phoneNo))

        return SignInResponse(accessToken, refreshToken)
    }

    @Transactional(readOnly = true)
    fun reissueToken(request: ReissueTokenRequest): ReissueTokenResponse {
        val userId = jwtTokenProvider.validateAndGetUserId(request.refreshToken)

        userRepository.findByIdOrNull(userId)
            ?: throw AuthenticationException(AuthenticationException.Reason.USER_NOT_FOUND)

        validateRefreshToken(userId, request.refreshToken)

        val newAccessToken = jwtTokenProvider.generateAccessToken(userId)
        val newRefreshToken = jwtTokenProvider.generateRefreshToken(userId)

        eventPublisher.publishEvent(RefreshTokenDeleteEvent(userId))
        eventPublisher.publishEvent(RefreshTokenSaveEvent(userId, newRefreshToken))

        return ReissueTokenResponse(newAccessToken, newRefreshToken)
    }

    // Private helper methods

    private fun validateVerificationCode(phoneNo: String, verificationCode: String) {
        val savedCode = verificationCodeRedisRepository.find(phoneNo)

        when {
            savedCode == null -> throw AuthenticationException(AuthenticationException.Reason.VERIFICATION_CODE_NOT_FOUND)
            savedCode != verificationCode -> throw AuthenticationException(AuthenticationException.Reason.VERIFICATION_CODE_MISMATCH)
        }
    }

    private fun validateVerifiedToken(phoneNo: String, verifiedToken: String) {
        val savedToken = verifiedTokenRedisRepository.find(phoneNo)

        when {
            savedToken == null -> throw AuthenticationException(AuthenticationException.Reason.VERIFIED_TOKEN_NOT_FOUND)
            savedToken != verifiedToken -> throw AuthenticationException(AuthenticationException.Reason.VERIFIED_TOKEN_MISMATCH)
        }
    }

    private fun validateRefreshToken(userId: Long, refreshToken: String) {
        val savedRefreshToken = refreshTokenRedisRepository.find(userId)

        when {
            savedRefreshToken == null -> throw AuthenticationException(AuthenticationException.Reason.REFRESH_TOKEN_NOT_FOUND)
            savedRefreshToken != refreshToken -> throw AuthenticationException(AuthenticationException.Reason.REFRESH_TOKEN_MISMATCH)
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