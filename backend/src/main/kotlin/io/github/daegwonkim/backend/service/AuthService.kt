package io.github.daegwonkim.backend.service

import io.github.daegwonkim.backend.common.exception.ErrorCode
import io.github.daegwonkim.backend.common.exception.ExternalServiceException
import io.github.daegwonkim.backend.common.exception.NotFoundException
import io.github.daegwonkim.backend.common.jwt.JwtTokenProvider
import io.github.daegwonkim.backend.common.jwt.RefreshTokenService
import io.github.daegwonkim.backend.dto.PhoneNoConfirmRequest
import io.github.daegwonkim.backend.dto.SigninRequest
import io.github.daegwonkim.backend.dto.SigninResponse
import io.github.daegwonkim.backend.dto.VerificationCodeConfirmRequest
import io.github.daegwonkim.backend.dto.VerificationCodeConfirmResponse
import io.github.daegwonkim.backend.dto.VerificationCodeSendRequest
import io.github.daegwonkim.backend.repository.UserRepository
import net.nurigo.sdk.message.model.Message
import net.nurigo.sdk.message.request.SingleMessageSendingRequest
import net.nurigo.sdk.message.service.DefaultMessageService
import org.springframework.beans.factory.annotation.Value
import org.springframework.data.redis.core.StringRedisTemplate
import org.springframework.stereotype.Service
import java.security.SecureRandom
import java.util.UUID
import java.util.concurrent.TimeUnit
import kotlin.also

@Service
class AuthService(
    private val messageService: DefaultMessageService,
    private val refreshTokenService: RefreshTokenService,
    private val stringRedisTemplate: StringRedisTemplate,
    private val jwtTokenProvider: JwtTokenProvider,
    private val userRepository: UserRepository,
    @Value($$"${coolsms.from}")
    private val smsFrom: String,
    @Value($$"${verification-code.expiration}")
    private val verificationCodeExpiration: Long,
    @Value($$"${verified-token.expiration}")
    private val verifiedTokenExpiration: Long
) {
    companion object {
        private const val VERIFICATION_CODE_KEY_PREFIX = "verificationCode:"
        private const val VERIFIED_TOKEN_KEY_PREFIX = "verifiedToken:"
        private const val COOLSMS_SUCCESS_CODE = "2000"
        private const val VERIFICATION_CODE_LENGTH = 6
    }

    fun sendVerificationCode(request: VerificationCodeSendRequest) {
        val verificationCode = generateVerificationCode()

        sendSms(request.phoneNo, verificationCode)
            .takeIf { it }
            ?.also { stringRedisTemplate.saveVerificationCode(request.phoneNo, verificationCode) }
            ?: throw ExternalServiceException(ErrorCode.SMS_SEND_FAILED)
    }

    fun confirmVerificationCode(request: VerificationCodeConfirmRequest): VerificationCodeConfirmResponse {
        val savedCode = stringRedisTemplate.getVerificationCode(request.phoneNo)
            ?: throw NotFoundException(ErrorCode.VERIFICATION_CODE_NOT_FOUND)

        savedCode.takeIf { it == request.verificationCode }
            ?: throw NotFoundException(ErrorCode.VERIFICATION_CODE_MISMATCH)

        stringRedisTemplate.deleteVerificationCode(request.phoneNo)

        val verifiedToken = UUID.randomUUID().toString().also { verifiedToken ->
            stringRedisTemplate.saveVerifiedToken(request.phoneNo, verifiedToken)
        }

        return VerificationCodeConfirmResponse(verifiedToken)
    }

    fun confirmPhoneNo(request: PhoneNoConfirmRequest) {
        userRepository.findByPhoneNoAndIsWithdrawnFalse(request.phoneNo)
            ?: throw NotFoundException(ErrorCode.USER_NOT_FOUND)
    }

    fun signin(request: SigninRequest): SigninResponse {
        val user = userRepository.findByPhoneNoAndIsWithdrawnFalse(request.phoneNo)
            ?: throw NotFoundException(ErrorCode.USER_NOT_FOUND)
        val userId = requireNotNull(user.id) { "User ID cannot be null" }

        val savedToken = stringRedisTemplate.getVerifiedToken(request.phoneNo)
            ?: throw NotFoundException(ErrorCode.VERIFIED_TOKEN_NOT_FOUND)

        savedToken.takeIf { it == request.verifiedToken }
            ?: throw NotFoundException(ErrorCode.VERIFIED_TOKEN_MISMATCH)

        stringRedisTemplate.deleteVerifiedToken(request.phoneNo)

        val accessToken = jwtTokenProvider.generateAccessToken(userId)
        val refreshToken = jwtTokenProvider.generateRefreshToken(userId)

        refreshTokenService.saveRefreshToken(userId, refreshToken)

        return SigninResponse(accessToken)
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

    private fun verificationCodeKey(phoneNo: String): String = "$VERIFICATION_CODE_KEY_PREFIX$phoneNo"
    private fun verifiedTokenKey(phoneNo: String): String = "$VERIFIED_TOKEN_KEY_PREFIX$phoneNo"

    private fun Int.pow(exponent: Int): Int =
        (1..exponent).fold(1) { acc, _ -> acc * this }

    /**
     * Redis Extension Functions
     */
    private fun StringRedisTemplate.getVerificationCode(phoneNo: String): String? =
        opsForValue().get(verificationCodeKey(phoneNo))

    private fun StringRedisTemplate.saveVerificationCode(phoneNo: String, code: String) {
        opsForValue().set(
            verificationCodeKey(phoneNo),
            code,
            verificationCodeExpiration,
            TimeUnit.MINUTES
        )
    }

    private fun StringRedisTemplate.deleteVerificationCode(phoneNo: String) =
        delete(verificationCodeKey(phoneNo))

    private fun StringRedisTemplate.getVerifiedToken(phoneNo: String): String? =
        opsForValue().get(verifiedTokenKey(phoneNo))

    private fun StringRedisTemplate.saveVerifiedToken(phoneNo: String, token: String) {
        opsForValue().set(
            verifiedTokenKey(phoneNo),
            token,
            verifiedTokenExpiration,
            TimeUnit.MINUTES
        )
    }

    private fun StringRedisTemplate.deleteVerifiedToken(phoneNo: String) =
        delete(verifiedTokenKey(phoneNo))
}