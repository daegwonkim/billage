package io.github.daegwonkim.backend.service

import io.github.daegwonkim.backend.common.exception.ErrorCode
import io.github.daegwonkim.backend.common.exception.ExternalServiceException
import io.github.daegwonkim.backend.common.exception.InvalidValueException
import io.github.daegwonkim.backend.common.exception.NotFoundException
import io.github.daegwonkim.backend.common.jwt.JwtTokenProvider
import io.github.daegwonkim.backend.repository.RefreshTokenRedisRepository
import io.github.daegwonkim.backend.dto.TokenReissueResponse
import io.github.daegwonkim.backend.dto.PhoneNoConfirmRequest
import io.github.daegwonkim.backend.dto.TokenReissueRequest
import io.github.daegwonkim.backend.dto.SigninRequest
import io.github.daegwonkim.backend.dto.SigninResponse
import io.github.daegwonkim.backend.dto.SignupRequest
import io.github.daegwonkim.backend.dto.SignupResponse
import io.github.daegwonkim.backend.dto.VerificationCodeConfirmRequest
import io.github.daegwonkim.backend.dto.VerificationCodeConfirmResponse
import io.github.daegwonkim.backend.dto.VerificationCodeSendRequest
import io.github.daegwonkim.backend.entity.User
import io.github.daegwonkim.backend.common.event.dto.RefreshTokenDeleteEvent
import io.github.daegwonkim.backend.common.event.dto.RefreshTokenSaveEvent
import io.github.daegwonkim.backend.common.event.dto.VerifiedTokenDeleteEvent
import io.github.daegwonkim.backend.repository.VerifiedTokenRedisRepository
import io.github.daegwonkim.backend.repository.UserRepository
import io.github.daegwonkim.backend.repository.VerificationCodeRedisRepository
import io.github.daegwonkim.backend.util.NicknameGenerator
import net.nurigo.sdk.message.model.Message
import net.nurigo.sdk.message.request.SingleMessageSendingRequest
import net.nurigo.sdk.message.service.DefaultMessageService
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.ApplicationEventPublisher
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.security.SecureRandom
import java.util.UUID

@Service
class AuthService(
    private val messageService: DefaultMessageService,
    private val refreshTokenRedisRepository: RefreshTokenRedisRepository,
    private val verifiedTokenRedisRepository: VerifiedTokenRedisRepository,
    private val verificationCodeRedisRepository: VerificationCodeRedisRepository,
    private val jwtTokenProvider: JwtTokenProvider,
    private val userRepository: UserRepository,
    private val eventPublisher: ApplicationEventPublisher,
    private val nicknameGenerator: NicknameGenerator,
    @Value($$"${coolsms.from}")
    private val smsFrom: String
) {
    companion object {
        private const val COOLSMS_SUCCESS_CODE = "2000"
        private const val VERIFICATION_CODE_LENGTH = 6
        private const val MAX_NICKNAME_RETRY = 10
    }

    fun sendVerificationCode(request: VerificationCodeSendRequest) {
        val verificationCode = generateVerificationCode()

        runCatching {
            sendSms(request.phoneNo, verificationCode)
        }.onSuccess { success ->
            if (success) {
                verificationCodeRedisRepository.save(request.phoneNo, verificationCode)
            } else {
                throw ExternalServiceException(ErrorCode.SMS_SEND_FAILED)
            }
        }.onFailure {
            throw ExternalServiceException(ErrorCode.SMS_SEND_FAILED, it)
        }
    }

    fun confirmVerificationCode(request: VerificationCodeConfirmRequest): VerificationCodeConfirmResponse {
        validateVerificationCode(request.phoneNo, request.verificationCode)

        verificationCodeRedisRepository.delete(request.phoneNo)

        val verifiedToken = UUID.randomUUID().toString()
        verifiedTokenRedisRepository.save(request.phoneNo, verifiedToken)

        return VerificationCodeConfirmResponse(verifiedToken)
    }

    @Transactional(readOnly = true)
    fun confirmPhoneNo(request: PhoneNoConfirmRequest) {
        userRepository.findByPhoneNoAndIsWithdrawnFalse(request.phoneNo)
            ?: throw NotFoundException(ErrorCode.USER_NOT_FOUND)
    }

    @Transactional
    fun signup(request: SignupRequest): SignupResponse {
        validateVerifiedToken(request.phoneNo, request.verifiedToken)

        val user = userRepository.save(
            User(
                phoneNo = request.phoneNo,
                nickname = generateUniqueNickname()
            )
        )
        val userId = user.id!!

        val accessToken = jwtTokenProvider.generateAccessToken(userId)
        val refreshToken = jwtTokenProvider.generateRefreshToken(userId)

        eventPublisher.publishEvent(RefreshTokenSaveEvent(userId, refreshToken))
        eventPublisher.publishEvent(VerifiedTokenDeleteEvent(request.phoneNo))

        return SignupResponse(accessToken, refreshToken)
    }

    @Transactional(readOnly = true)
    fun signin(request: SigninRequest): SigninResponse {
        val user = userRepository.findByPhoneNoAndIsWithdrawnFalse(request.phoneNo)
            ?: throw NotFoundException(ErrorCode.USER_NOT_FOUND)

        validateVerifiedToken(request.phoneNo, request.verifiedToken)

        val userId = user.id!!

        val accessToken = jwtTokenProvider.generateAccessToken(userId)
        val refreshToken = jwtTokenProvider.generateRefreshToken(userId)

        eventPublisher.publishEvent(RefreshTokenSaveEvent(userId, refreshToken))
        eventPublisher.publishEvent(VerifiedTokenDeleteEvent(request.phoneNo))

        return SigninResponse(accessToken, refreshToken)
    }

    @Transactional(readOnly = true)
    fun reissueToken(request: TokenReissueRequest): TokenReissueResponse {
        if (!jwtTokenProvider.validateToken(request.refreshToken)) {
            throw InvalidValueException(ErrorCode.INVALID_REFRESH_TOKEN)
        }

        val userId = jwtTokenProvider.getUserIdFromToken(request.refreshToken)
        val savedRefreshToken = refreshTokenRedisRepository.find(userId)
            ?: throw NotFoundException(ErrorCode.REFRESH_TOKEN_NOT_FOUND)

        userRepository.findByIdOrNull(userId)
            ?: throw NotFoundException(ErrorCode.USER_NOT_FOUND)

        if (savedRefreshToken != request.refreshToken) {
            throw NotFoundException(ErrorCode.REFRESH_TOKEN_MISMATCH)
        }

        val newAccessToken = jwtTokenProvider.generateAccessToken(userId)
        val newRefreshToken = jwtTokenProvider.generateRefreshToken(userId)

        eventPublisher.publishEvent(RefreshTokenDeleteEvent(userId))
        eventPublisher.publishEvent(RefreshTokenSaveEvent(userId, newRefreshToken))

        return TokenReissueResponse(newAccessToken, newRefreshToken)
    }

    // Private helper methods

    private fun validateVerificationCode(phoneNo: String, code: String) {
        val savedCode = verificationCodeRedisRepository.find(phoneNo)
            ?: throw NotFoundException(ErrorCode.VERIFICATION_CODE_NOT_FOUND)

        if (savedCode != code) {
            throw NotFoundException(ErrorCode.VERIFICATION_CODE_MISMATCH)
        }
    }

    private fun validateVerifiedToken(phoneNo: String, token: String) {
        val savedToken = verifiedTokenRedisRepository.find(phoneNo)
            ?: throw NotFoundException(ErrorCode.VERIFIED_TOKEN_NOT_FOUND)

        if (savedToken != token) {
            throw NotFoundException(ErrorCode.VERIFIED_TOKEN_MISMATCH)
        }
    }

    private fun generateUniqueNickname(): String {
        repeat(MAX_NICKNAME_RETRY) {
            val nickname = nicknameGenerator.generate()
            if (!userRepository.existsByNickname(nickname)) {
                return nickname
            }
        }
        throw IllegalStateException("Failed to generate unique nickname after $MAX_NICKNAME_RETRY attempts")
    }

    private fun sendSms(phoneNo: String, code: String): Boolean {
        val message = Message().apply {
            from = smsFrom
            to = phoneNo
            text = buildVerificationCodeMessage(code)
        }

        return messageService.sendOne(SingleMessageSendingRequest(message))
            ?.statusCode == COOLSMS_SUCCESS_CODE
    }

    private fun buildVerificationCodeMessage(code: String): String =
        "[빌리지] 인증번호는 [$code] 입니다.\n*절대 타인에게 노출하지 마세요.*"

    private fun generateVerificationCode(): String =
        SecureRandom().nextInt(10.pow(VERIFICATION_CODE_LENGTH))
            .let { "%0${VERIFICATION_CODE_LENGTH}d".format(it) }

    private fun Int.pow(exponent: Int): Int =
        (1..exponent).fold(1) { acc, _ -> acc * this }
}